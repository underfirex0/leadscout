export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { CRMStatus, CRMPriority, CallOutcome } from '@/types'

type Params = { params: { id: string } }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const {
      status, priority, notes, next_action_at, last_contacted_at,
      call_outcome, call_notes,
    }: {
      status?: CRMStatus
      priority?: CRMPriority
      notes?: string
      next_action_at?: string | null
      last_contacted_at?: string
      call_outcome?: CallOutcome
      call_notes?: string
    } = body

    // Verify ownership
    const { data: lead } = await supabaseAdmin
      .from('crm_leads')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 })

    // Update lead
    const updateData: Record<string, unknown> = {}
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (notes !== undefined) updateData.notes = notes
    if (next_action_at !== undefined) updateData.next_action_at = next_action_at
    if (last_contacted_at !== undefined) updateData.last_contacted_at = last_contacted_at

    if (Object.keys(updateData).length > 0) {
      await supabaseAdmin
        .from('crm_leads')
        .update(updateData)
        .eq('id', params.id)
    }

    // Log call if outcome provided
    if (call_outcome) {
      await supabaseAdmin.from('crm_call_logs').insert({
        lead_id: params.id,
        user_id: user.id,
        outcome: call_outcome,
        notes: call_notes || null,
      })

      // Auto-update status based on outcome
      const outcomeStatusMap: Record<CallOutcome, CRMStatus> = {
        no_answer: 'to_call',
        voicemail: 'to_call',
        callback: 'callback',
        interested: 'interested',
        not_interested: 'not_interested',
      }
      await supabaseAdmin
        .from('crm_leads')
        .update({
          status: outcomeStatusMap[call_outcome],
          last_contacted_at: new Date().toISOString(),
        })
        .eq('id', params.id)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('CRM PATCH error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    await supabaseAdmin
      .from('crm_leads')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
