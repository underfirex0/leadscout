export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { FIELD_COSTS } from '@/lib/constants'
import type { Business } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { businessId, field } = body as { businessId: string; field: string }

    if (!businessId || !field) {
      return NextResponse.json({ error: 'businessId et field requis' }, { status: 400 })
    }

    const cost = FIELD_COSTS[field]
    if (cost === undefined) {
      return NextResponse.json({ error: 'Champ invalide ou gratuit' }, { status: 400 })
    }

    // ── Check if already unlocked ─────────────────────────────────
    const { data: existing } = await supabaseAdmin
      .from('unlock_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('business_id', businessId)
      .eq('field', field)
      .maybeSingle()

    // Fetch business record (we need it for the value)
    const { data: business, error: bizError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (bizError || !business) {
      return NextResponse.json({ error: 'Entreprise introuvable' }, { status: 404 })
    }

    const value = (business as unknown as Record<string, string | null>)[field]
    if (!value) {
      return NextResponse.json({ error: 'Valeur non disponible pour ce champ' }, { status: 404 })
    }

    if (existing) {
      // Already unlocked — return value without charging
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('credit_balance')
        .eq('id', user.id)
        .single()

      return NextResponse.json({
        value,
        creditsSpent: 0,
        newBalance: profile?.credit_balance ?? 0,
        alreadyUnlocked: true,
      })
    }

    // ── Check balance ─────────────────────────────────────────────
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('credit_balance')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

    if (profile.credit_balance < cost) {
      return NextResponse.json(
        { error: 'Crédits insuffisants', required: cost, available: profile.credit_balance },
        { status: 402 }
      )
    }

    // ── Deduct credits ────────────────────────────────────────────
    const { data: newBalance, error: deductError } = await supabaseAdmin.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: cost,
      p_type: 'unlock',
      p_ref_id: businessId,
      p_description: `Déverrouillage ${field} — ${(business as unknown as Business).name}`,
    })

    if (deductError) {
      if (deductError.message?.includes('Insufficient')) {
        return NextResponse.json(
          { error: 'Crédits insuffisants', required: cost, available: profile.credit_balance },
          { status: 402 }
        )
      }
      console.error('Deduct error:', deductError)
      return NextResponse.json({ error: 'Erreur déduction crédits' }, { status: 500 })
    }

    // ── Record unlock event ───────────────────────────────────────
    const { error: unlockError } = await supabaseAdmin
      .from('unlock_events')
      .insert({
        user_id: user.id,
        business_id: businessId,
        field,
        credits_spent: cost,
      })

    if (unlockError) {
      // This can happen if there's a race condition (unique constraint)
      // In that case, the credits were already deducted — we should refund
      if (unlockError.code === '23505') {
        // Unique violation — already unlocked, refund
        await supabaseAdmin.rpc('add_credits', {
          p_user_id: user.id,
          p_amount: cost,
          p_type: 'refund',
          p_description: `Remboursement doublon: ${field} — ${(business as unknown as Business).name}`,
        })
        return NextResponse.json({
          value,
          creditsSpent: 0,
          newBalance: profile.credit_balance, // approximate
          alreadyUnlocked: true,
        })
      }
      console.error('Unlock insert error:', unlockError)
      return NextResponse.json({ error: 'Erreur enregistrement déverrouillage' }, { status: 500 })
    }

    return NextResponse.json({
      value,
      creditsSpent: cost,
      newBalance: newBalance as number,
      alreadyUnlocked: false,
    })
  } catch (e) {
    console.error('Unlock API error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
