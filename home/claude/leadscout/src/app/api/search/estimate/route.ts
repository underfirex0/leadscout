export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { FIELD_COSTS } from '@/lib/constants'
import { calculateCostPerBusiness } from '@/lib/utils'
import type { SearchFilters } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const fields = searchParams.getAll('fields')
    const filters: SearchFilters = {
      search: searchParams.get('search') || undefined,
      sector: searchParams.get('sector') || undefined,
      city: searchParams.get('city') || undefined,
      region: searchParams.get('region') || undefined,
      effectif_label: searchParams.get('effectif_label') || undefined,
    }

    // Build count query
    let dbQuery = supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true })

    if (filters.search) {
      dbQuery = dbQuery.or(`name.ilike.%${filters.search}%,sector.ilike.%${filters.search}%`)
    }
    if (filters.sector) dbQuery = dbQuery.eq('sector', filters.sector)
    if (filters.city) dbQuery = dbQuery.eq('city', filters.city)
    if (filters.region) dbQuery = dbQuery.eq('region', filters.region)
    if (filters.effectif_label) dbQuery = dbQuery.eq('effectif_label', filters.effectif_label)

    const { count, error } = await dbQuery

    if (error) {
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    const validFields = fields.filter(f => FIELD_COSTS[f] !== undefined)
    const costPerBusiness = calculateCostPerBusiness(validFields)
    const totalCount = count ?? 0
    const totalCost = costPerBusiness * totalCount

    return NextResponse.json({
      count: totalCount,
      costPerBusiness,
      totalCost,
      fieldsRequested: validFields,
    })
  } catch (e) {
    console.error('Estimate error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
