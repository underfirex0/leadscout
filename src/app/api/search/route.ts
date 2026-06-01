export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { FIELD_COSTS, FREE_FIELDS, MAX_RESULTS } from '@/lib/constants'
import { calculateCostPerBusiness } from '@/lib/utils'
import type { SearchFilters, MaskedBusiness, Business } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { filters, fields }: { filters: SearchFilters; fields: string[] } = body

    if (!fields || fields.length === 0) {
      return NextResponse.json({ error: 'Aucun champ sélectionné' }, { status: 400 })
    }

    // Validate fields
    const validFields = fields.filter(f => FIELD_COSTS[f] !== undefined || FREE_FIELDS.includes(f))

    // ── Build Supabase query ──────────────────────────────────────
    let dbQuery = supabaseAdmin.from('businesses').select('*', { count: 'exact' })

    if (filters?.search) {
      dbQuery = dbQuery.or(
        `name.ilike.%${filters.search}%,sector.ilike.%${filters.search}%`
      )
    }
    if (filters?.sector) dbQuery = dbQuery.eq('sector', filters.sector)
    if (filters?.city) dbQuery = dbQuery.eq('city', filters.city)
    if (filters?.region) dbQuery = dbQuery.eq('region', filters.region)
    if (filters?.effectif_label) dbQuery = dbQuery.eq('effectif_label', filters.effectif_label)

    dbQuery = dbQuery.order('name').limit(MAX_RESULTS)

    const { data: businesses, count, error: dbError } = await dbQuery

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    const totalCount = count ?? 0

    // ── Calculate cost ────────────────────────────────────────────
    const premiumFields = validFields.filter(f => FIELD_COSTS[f] !== undefined)
    const costPerBiz = calculateCostPerBusiness(validFields)
    const totalCost = costPerBiz * totalCount

    // Zero results → return early without deducting
    if (totalCount === 0) {
      return NextResponse.json({
        queryId: null,
        businesses: [],
        totalCount: 0,
        creditsSpent: 0,
        newBalance: null,
        fieldsRequested: validFields,
        filters,
      })
    }

    // ── Check balance ─────────────────────────────────────────────
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('credit_balance')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

    if (profile.credit_balance < totalCost) {
      return NextResponse.json(
        { error: 'Crédits insuffisants', required: totalCost, available: profile.credit_balance },
        { status: 402 }
      )
    }

    // ── Create query record first ─────────────────────────────────
    const { data: queryRecord, error: queryError } = await supabaseAdmin
      .from('queries')
      .insert({
        user_id: user.id,
        filters: filters ?? {},
        fields_requested: validFields,
        result_count: totalCount,
        credits_spent: totalCost,
        status: 'complete',
      })
      .select()
      .single()

    if (queryError) {
      console.error('Query insert error:', queryError)
      return NextResponse.json({ error: 'Erreur création requête' }, { status: 500 })
    }

    // ── Deduct credits atomically via DB function ─────────────────
    let newBalance = profile.credit_balance
    if (totalCost > 0) {
      const { data: balanceAfter, error: deductError } = await supabaseAdmin.rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: totalCost,
        p_type: 'query',
        p_ref_id: queryRecord.id,
        p_description: `Recherche : ${filters?.sector || 'Tous'} / ${filters?.city || 'Toutes villes'} — ${totalCount} entreprises × ${costPerBiz} cr`,
      })

      if (deductError) {
        // Rollback query record on credit failure
        await supabaseAdmin.from('queries').delete().eq('id', queryRecord.id)
        if (deductError.message?.includes('Insufficient')) {
          return NextResponse.json(
            { error: 'Crédits insuffisants', required: totalCost, available: profile.credit_balance },
            { status: 402 }
          )
        }
        console.error('Deduct error:', deductError)
        return NextResponse.json({ error: 'Erreur déduction crédits' }, { status: 500 })
      }

      newBalance = balanceAfter as number
    }

    // ── Get unlock events for this user (à la carte unlocks) ──────
    const { data: unlockEvents } = await supabaseAdmin
      .from('unlock_events')
      .select('business_id, field')
      .eq('user_id', user.id)
      .in('business_id', (businesses ?? []).map(b => b.id))

    // Build unlock map: { businessId: { field: value } }
    const unlockMap: Record<string, Record<string, string>> = {}
    if (unlockEvents) {
      // We need to fetch actual values for unlocked fields
      for (const evt of unlockEvents) {
        if (!unlockMap[evt.business_id]) unlockMap[evt.business_id] = {}
        // Get value from the businesses array we already have
        const biz = (businesses ?? []).find(b => b.id === evt.business_id)
        if (biz) {
          unlockMap[evt.business_id][evt.field] = (biz as unknown as Record<string, string>)[evt.field]
        }
      }
    }

    // ── Mask businesses ───────────────────────────────────────────
    const maskedBusinesses: MaskedBusiness[] = (businesses ?? []).map(biz => {
      const b = biz as unknown as Business
      const unlocked = unlockMap[b.id] ?? {}

      const masked: MaskedBusiness = {
        id: b.id,
        name: b.name,
        sector: b.sector,
        subsector: b.subsector,
        region: b.region,
        city: b.city,
        country: b.country,
        legal_form: b.legal_form,
        phone: premiumFields.includes('phone') ? b.phone : null,
        email: premiumFields.includes('email') ? b.email : null,
        website: premiumFields.includes('website') ? b.website : null,
        address: premiumFields.includes('address') ? b.address : null,
        effectif_label: premiumFields.includes('effectif_label') ? b.effectif_label : null,
        dirigeant_name: premiumFields.includes('dirigeant_name') ? b.dirigeant_name : null,
        dirigeant_phone: premiumFields.includes('dirigeant_phone') ? b.dirigeant_phone : null,
        dirigeant_email: premiumFields.includes('dirigeant_email') ? b.dirigeant_email : null,
        revenue_label: premiumFields.includes('revenue_label') ? b.revenue_label : null,
        unlocked,
      }
      return masked
    })

    return NextResponse.json({
      queryId: queryRecord.id,
      businesses: maskedBusinesses,
      totalCount,
      creditsSpent: totalCost,
      newBalance,
      fieldsRequested: validFields,
      filters,
    })
  } catch (e) {
    console.error('Search API error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
