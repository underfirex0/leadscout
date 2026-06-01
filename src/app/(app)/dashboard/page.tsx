import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Search, Wallet, TrendingUp, Clock, ChevronRight, Building2, Zap
} from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'
import type { Query, CreditTransaction } from '@/types'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile + recent queries + recent transactions in parallel
  const [
    { data: profile },
    { data: queries },
    { data: transactions },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('queries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const totalQueries = queries?.length ?? 0
  const totalCreditsSpent = queries?.reduce((sum, q) => sum + (q.credits_spent ?? 0), 0) ?? 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Bonjour{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-slate-500 mt-1">Voici un aperçu de votre activité.</p>
        </div>
        <Link href="/search" className="btn-primary flex items-center gap-2 self-start">
          <Search className="w-4 h-4" />
          Nouvelle recherche
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Solde crédits</span>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 font-bold text-xs">◆</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 font-mono">
            {formatNumber(profile?.credit_balance ?? 0)}
          </p>
          <Link href="/wallet" className="text-xs text-brand-600 font-medium mt-2 flex items-center gap-1 hover:underline">
            Voir les transactions <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Recherches</span>
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-brand-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 font-mono">{totalQueries}</p>
          <p className="text-xs text-slate-400 mt-2">requêtes effectuées</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Crédits dépensés</span>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 font-mono">
            {formatNumber(totalCreditsSpent)}
          </p>
          <p className="text-xs text-slate-400 mt-2">total crédits utilisés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent queries */}
        <div className="card">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Recherches récentes
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {!queries || queries.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-4">Aucune recherche pour l&apos;instant.</p>
                <Link href="/search" className="btn-primary text-sm py-1.5">
                  Lancer ma première recherche
                </Link>
              </div>
            ) : (
              (queries as Query[]).map(query => (
                <div key={query.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {query.filters?.sector || 'Tous secteurs'}
                      {query.filters?.city ? ` · ${query.filters.city}` : ''}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(query.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500">{query.result_count} résultats</span>
                    <span className="badge-amber text-xs">{query.credits_spent} cr</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link
                href="/search"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all group"
              >
                <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                  <Search className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Nouvelle recherche</p>
                  <p className="text-xs text-slate-500">Filtrer et débloquer des entreprises</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-brand-600 transition-colors" />
              </Link>

              <Link
                href="/wallet"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
              >
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Wallet className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Mes crédits</p>
                  <p className="text-xs text-slate-500">
                    Solde actuel : {formatNumber(profile?.credit_balance ?? 0)} crédits
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-amber-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Tip card */}
          {(profile?.credit_balance ?? 0) < 20 && (
            <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Crédits faibles</p>
                  <p className="text-xs text-amber-700">
                    Votre solde est bas. Contactez-nous pour recharger votre compte.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
