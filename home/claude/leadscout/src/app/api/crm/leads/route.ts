export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { MaskedBusiness, CRMStatus } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as CRMStatus | null

    let query = supabaseAdmin
      .from('crm_leads')
      .select('*, call_logs:crm_call_logs(*)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data: leads, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (!leads || leads.length === 0) {
      return NextResponse.json({ leads: [] })
    }

    // Fetch businesses
    const bizIds = Array.from(new Set(leads.map(l => l.business_id)))
    const { data: businesses } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .in('id', bizIds)

    // Fetch unlock events
    const { data: unlockEvents } = await supabaseAdmin
      .from('unlock_events')
      .select('business_id, field')
      .eq('user_id', user.id)
      .in('business_id', bizIds)

    const unlockMap: Record<string, Record<string, string>> = {}
    if (unlockEvents && businesses) {
      for (const evt of unlockEvents) {
        if (!unlockMap[evt.business_id]) unlockMap[evt.business_id] = {}
        const biz = businesses.find(b => b.id === evt.business_id)
        if (biz) {
          const val = (biz as Record<string, string | null>)[evt.field]
          if (val) unlockMap[evt.business_id][evt.field] = val
        }
      }
    }

    // Build enriched leads
    const enriched = leads.map(lead => {
      const biz = businesses?.find(b => b.id === lead.business_id)
      const unlocked = unlockMap[lead.business_id] ?? {}

      const maskedBiz: MaskedBusiness | undefined = biz ? {
        id: biz.id,
        name: biz.name,
        sector: biz.sector,
        subsector: biz.subsector,
        region: biz.region,
        city: biz.city,
        country: biz.country,
        legal_form: biz.legal_form,
        phone: unlocked.phone ?? biz.phone ?? null,
        email: unlocked.email ?? biz.email ?? null,
        website: unlocked.website ?? biz.website ?? null,
        address: unlocked.address ?? biz.address ?? null,
        effectif_label: unlocked.effectif_label ?? biz.effectif_label ?? null,
        dirigeant_name: unlocked.dirigeant_name ?? biz.dirigeant_name ?? null,
        dirigeant_phone: unlocked.dirigeant_phone ?? biz.dirigeant_phone ?? null,
        dirigeant_email: unlocked.dirigeant_email ?? biz.dirigeant_email ?? null,
        revenue_label: unlocked.revenue_label ?? biz.revenue_label ?? null,
        unlocked,
      } : undefined

      return { ...lead, business: maskedBiz }
    })

    // Status counts
    const { data: allLeads } = await supabaseAdmin
      .from('crm_leads')
      .select('status')
      .eq('user_id', user.id)

    const counts: Record<string, number> = {}
    allLeads?.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1 })

    return NextResponse.json({ leads: enriched, counts })
  } catch (e) {
    console.error('CRM GET error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { businessIds, queryId }: { businessIds: string[]; queryId?: string } = body

    if (!businessIds || businessIds.length === 0) {
      return NextResponse.json({ error: 'businessIds requis' }, { status: 400 })
    }

    // Upsert: if already in CRM, don't reset status
    const records = businessIds.map(bid => ({
      user_id: user.id,
      business_id: bid,
      query_id: queryId || null,
      status: 'to_call',
    }))

    const { data, error } = await supabaseAdmin
      .from('crm_leads')
      .upsert(records, {
        onConflict: 'user_id,business_id',
        ignoreDuplicates: true, // Don't overwrite existing leads
      })
      .select()

    if (error) {
      console.error('CRM insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      added: data?.length ?? 0,
      total: businessIds.length,
      message: `${data?.length ?? 0} lead(s) ajouté(s) au CRM`,
    })
  } catch (e) {
    console.error('CRM POST error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
