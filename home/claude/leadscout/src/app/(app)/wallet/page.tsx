import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Wallet, TrendingDown, TrendingUp, Gift, Plus } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'
import type { CreditTransaction } from '@/types'
import { cn } from '@/lib/utils'

const TX_ICONS = {
  grant: { icon: Gift, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Bonus' },
  query: { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50', label: 'Recherche' },
  unlock: { icon: TrendingDown, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Déverrouillage' },
  refund: { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Remboursement' },
  purchase: { icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Achat' },
}

export default async function WalletPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: transactions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const spent = transactions?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0
  const received = transactions?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) ?? 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mes crédits</h1>
        <p className="text-slate-500 mt-1">Historique de vos transactions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Solde actuel</span>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 font-bold text-xs">◆</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 font-mono">
            {formatNumber(profile?.credit_balance ?? 0)}
          </p>
          <p className="text-xs text-slate-400 mt-2">crédits disponibles</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total reçus</span>
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 font-mono">+{formatNumber(received)}</p>
          <p className="text-xs text-slate-400 mt-2">crédits reçus au total</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total dépensés</span>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 font-mono">-{formatNumber(spent)}</p>
          <p className="text-xs text-slate-400 mt-2">crédits utilisés</p>
        </div>
      </div>

      {/* Add credits CTA */}
      <div className="card p-6 bg-gradient-to-r from-brand-600 to-indigo-700 border-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">Besoin de plus de crédits ?</h3>
            <p className="text-brand-200 text-sm mt-1">
              Contactez-nous pour recharger votre compte. Tarifs flexibles sans abonnement.
            </p>
          </div>
          <a
            href="mailto:contact@leadscout.ma?subject=Rechargement de crédits&body=Bonjour, je souhaite recharger mon compte LeadScout."
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap shadow-sm"
          >
            <Wallet className="w-4 h-4" />
            Recharger mes crédits
          </a>
        </div>
      </div>

      {/* Packs info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: 'Starter', credits: 500, price: '149 MAD' },
          { name: 'Growth', credits: 2000, price: '499 MAD' },
          { name: 'Pro', credits: 10000, price: '1 990 MAD' },
          { name: 'Enterprise', credits: '∞', price: 'Sur devis' },
        ].map(pack => (
          <div key={pack.name} className="card p-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{pack.name}</p>
            <p className="text-2xl font-bold text-slate-900 font-mono mb-1">
              {typeof pack.credits === 'number' ? formatNumber(pack.credits) : pack.credits}
            </p>
            <p className="text-xs text-slate-400 mb-2">crédits</p>
            <p className="text-sm font-semibold text-brand-600">{pack.price}</p>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Historique des transactions</h2>
        </div>

        {!transactions || transactions.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500 text-sm">
            Aucune transaction pour l&apos;instant.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {(transactions as CreditTransaction[]).map(tx => {
              const config = TX_ICONS[tx.type] ?? TX_ICONS.grant
              const Icon = config.icon
              const isPositive = tx.amount > 0
              return (
                <div key={tx.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', config.bg)}>
                      <Icon className={cn('w-4 h-4', config.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {tx.description || config.label}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      'text-sm font-bold font-mono',
                      isPositive ? 'text-emerald-600' : 'text-red-500'
                    )}>
                      {isPositive ? '+' : ''}{tx.amount}
                    </p>
                    <p className="text-xs text-slate-400">
                      solde : {formatNumber(tx.balance_after)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
