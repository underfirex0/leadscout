export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { FIELD_COSTS, FIELD_LABELS } from '@/lib/constants'
import type { Business } from '@/types'

function escapeCSV(val: string | null | undefined): string {
  if (val == null) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const queryId = searchParams.get('queryId')
    if (!queryId) return NextResponse.json({ error: 'queryId requis' }, { status: 400 })

    // Fetch query (verify ownership)
    const { data: query, error: queryError } = await supabaseAdmin
      .from('queries')
      .select('*')
      .eq('id', queryId)
      .eq('user_id', user.id)
      .single()

    if (queryError || !query) {
      return NextResponse.json({ error: 'Requête introuvable' }, { status: 404 })
    }

    const filters = query.filters ?? {}
    const fieldsRequested: string[] = query.fields_requested ?? []
    const premiumFields = fieldsRequested.filter(f => FIELD_COSTS[f] !== undefined)

    // Re-run query
    let dbQuery = supabaseAdmin.from('businesses').select('*').order('name').limit(500)

    if (filters.search) dbQuery = dbQuery.or(`name.ilike.%${filters.search}%,sector.ilike.%${filters.search}%`)
    if (filters.sector) dbQuery = dbQuery.eq('sector', filters.sector)
    if (filters.city) dbQuery = dbQuery.eq('city', filters.city)
    if (filters.region) dbQuery = dbQuery.eq('region', filters.region)
    if (filters.effectif_label) dbQuery = dbQuery.eq('effectif_label', filters.effectif_label)

    const { data: businesses, error: dbError } = await dbQuery
    if (dbError) return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })

    // Get unlock events
    const { data: unlockEvents } = await supabaseAdmin
      .from('unlock_events')
      .select('business_id, field')
      .eq('user_id', user.id)
      .in('business_id', (businesses ?? []).map(b => b.id))

    const unlockMap: Record<string, Set<string>> = {}
    if (unlockEvents) {
      for (const evt of unlockEvents) {
        if (!unlockMap[evt.business_id]) unlockMap[evt.business_id] = new Set()
        unlockMap[evt.business_id].add(evt.field)
      }
    }

    // Build CSV columns
    const ALL_EXPORT_FIELDS = [
      'name', 'sector', 'subsector', 'city', 'region', 'country', 'legal_form',
      ...premiumFields,
    ]

    // Add any à la carte unlocked fields not in query fields
    if (businesses && unlockEvents) {
      const extraFields = new Set<string>()
      for (const evt of unlockEvents) {
        if (!premiumFields.includes(evt.field)) extraFields.add(evt.field)
      }
      extraFields.forEach(f => {
        if (!ALL_EXPORT_FIELDS.includes(f)) ALL_EXPORT_FIELDS.push(f)
      })
    }

    const headers = ALL_EXPORT_FIELDS.map(f => FIELD_LABELS[f] || f).join(',')

    const rows = (businesses ?? []).map(biz => {
      const b = biz as unknown as Business & Record<string, string | null>
      const unlockedFields = unlockMap[b.id] ?? new Set()

      return ALL_EXPORT_FIELDS.map(field => {
        if (['name', 'sector', 'subsector', 'city', 'region', 'country', 'legal_form'].includes(field)) {
          return escapeCSV(b[field])
        }
        if (premiumFields.includes(field) || unlockedFields.has(field)) {
          return escapeCSV(b[field])
        }
        return ''
      }).join(',')
    })

    const csv = [headers, ...rows].join('\n')
    const BOM = '\uFEFF' // UTF-8 BOM for Excel compatibility

    return new NextResponse(BOM + csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leadscout-export-${queryId.slice(0, 8)}.csv"`,
      },
    })
  } catch (e) {
    console.error('Export error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
