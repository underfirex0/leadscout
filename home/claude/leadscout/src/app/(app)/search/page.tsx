'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, SlidersHorizontal, CheckSquare, Square,
  Loader2, AlertCircle, ChevronDown, Info, Sparkles
} from 'lucide-react'
import { SECTORS, CITIES, REGIONS, EFFECTIF_OPTIONS, FIELD_COSTS, FIELD_LABELS, FREE_FIELDS } from '@/lib/constants'
import { calculateCost, calculateCostPerBusiness, cn } from '@/lib/utils'
import type { SearchFilters, SearchResult } from '@/types'

const PAID_FIELD_ORDER = [
  'phone', 'email', 'website', 'address',
  'effectif_label', 'dirigeant_name', 'dirigeant_phone', 'dirigeant_email',
  'revenue_label',
]

export default function SearchPage() {
  const router = useRouter()

  // Filters
  const [filters, setFilters] = useState<SearchFilters>({})
  const [selectedFields, setSelectedFields] = useState<string[]>(['phone', 'email'])

  // UI state
  const [estimating, setEstimating] = useState(false)
  const [running, setRunning] = useState(false)
  const [estimate, setEstimate] = useState<{ count: number; totalCost: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  // Fetch balance
  useEffect(() => {
    fetch('/api/me/balance').then(r => r.json()).then(d => {
      if (d.balance !== undefined) setBalance(d.balance)
    }).catch(() => {})
  }, [])

  const costPerBiz = calculateCostPerBusiness(selectedFields)

  function toggleField(field: string) {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    )
    setEstimate(null)
  }

  async function handleEstimate() {
    setEstimating(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.sector) params.set('sector', filters.sector)
      if (filters.city) params.set('city', filters.city)
      if (filters.region) params.set('region', filters.region)
      if (filters.effectif_label) params.set('effectif_label', filters.effectif_label)
      if (filters.search) params.set('search', filters.search)
      selectedFields.forEach(f => params.append('fields', f))

      const res = await fetch(`/api/search/estimate?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur estimation')
      setEstimate({ count: data.count, totalCost: data.totalCost })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setEstimating(false)
    }
  }

  async function handleRunSearch() {
    setRunning(true)
    setError(null)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, fields: selectedFields }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 402) {
          setError(`Crédits insuffisants : vous avez ${data.available} cr, il en faut ${data.required}.`)
        } else {
          throw new Error(data.error || 'Erreur recherche')
        }
        setRunning(false)
        return
      }

      // Store results in sessionStorage
      const result: SearchResult = data
      sessionStorage.setItem(`query_${result.queryId}`, JSON.stringify(result))
      router.push(`/results?queryId=${result.queryId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setRunning(false)
    }
  }

  const hasFilters = Object.values(filters).some(v => v)
  const costDisplay = estimate
    ? `${estimate.totalCost} crédit${estimate.totalCost !== 1 ? 's' : ''} pour ${estimate.count} entreprise${estimate.count !== 1 ? 's' : ''}`
    : selectedFields.length > 0
    ? `${costPerBiz} crédit${costPerBiz !== 1 ? 's' : ''}/entreprise`
    : '0 crédit/entreprise'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nouvelle recherche</h1>
        <p className="text-slate-500 mt-1">Définissez vos filtres, choisissez les champs et lancez.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Filters panel */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              Filtres
            </h2>

            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="label">Nom d&apos;entreprise</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={filters.search || ''}
                    onChange={e => { setFilters(f => ({ ...f, search: e.target.value || undefined })); setEstimate(null) }}
                    className="input pl-9"
                    placeholder="Recherche libre…"
                  />
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="label">Secteur d&apos;activité</label>
                <div className="relative">
                  <select
                    value={filters.sector || ''}
                    onChange={e => { setFilters(f => ({ ...f, sector: e.target.value || undefined })); setEstimate(null) }}
                    className="input appearance-none pr-9"
                  >
                    <option value="">Tous les secteurs</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="label">Ville</label>
                <div className="relative">
                  <select
                    value={filters.city || ''}
                    onChange={e => { setFilters(f => ({ ...f, city: e.target.value || undefined })); setEstimate(null) }}
                    className="input appearance-none pr-9"
                  >
                    <option value="">Toutes les villes</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="label">Région</label>
                <div className="relative">
                  <select
                    value={filters.region || ''}
                    onChange={e => { setFilters(f => ({ ...f, region: e.target.value || undefined })); setEstimate(null) }}
                    className="input appearance-none pr-9"
                  >
                    <option value="">Toutes les régions</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Effectif */}
              <div>
                <label className="label">Taille d&apos;effectif</label>
                <div className="relative">
                  <select
                    value={filters.effectif_label || ''}
                    onChange={e => { setFilters(f => ({ ...f, effectif_label: e.target.value || undefined })); setEstimate(null) }}
                    className="input appearance-none pr-9"
                  >
                    <option value="">Tous les effectifs</option>
                    {EFFECTIF_OPTIONS.map(o => <option key={o} value={o}>{o} employés</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={() => { setFilters({}); setEstimate(null) }}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fields panel */}
        <div className="lg:col-span-3 space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-500" />
                Champs à débloquer
              </h2>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Info className="w-3 h-3" />
                coût par entreprise
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Les champs libres (raison sociale, secteur, ville) sont toujours inclus.
            </p>

            {/* Free fields */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Toujours inclus — Gratuit</p>
              <div className="grid grid-cols-2 gap-2">
                {FREE_FIELDS.filter(f => !['country'].includes(f)).map(field => (
                  <div key={field} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-emerald-800 font-medium">{FIELD_LABELS[field] || field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Paid fields */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Champs payants</p>
              <div className="space-y-2">
                {PAID_FIELD_ORDER.map(field => {
                  const cost = FIELD_COSTS[field]
                  const checked = selectedFields.includes(field)
                  return (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleField(field)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all text-left',
                        checked
                          ? 'bg-brand-50 border-brand-200 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className={cn('text-sm font-medium', checked ? 'text-brand-900' : 'text-slate-700')}>
                          {FIELD_LABELS[field] || field}
                        </span>
                      </div>
                      <span className={cn(
                        'text-xs font-semibold rounded-full px-2 py-0.5',
                        checked
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-slate-100 text-slate-500'
                      )}>
                        +{cost} cr
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Cost summary + actions */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Résumé</h3>
              {balance !== null && (
                <span className="text-sm text-slate-500">
                  Solde : <span className="font-semibold text-amber-700">{balance.toLocaleString()} cr</span>
                </span>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Champs sélectionnés</span>
                <span className="font-medium text-slate-900">{selectedFields.length} champ{selectedFields.length > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Coût par entreprise</span>
                <span className="font-semibold text-slate-900">{costPerBiz} crédit{costPerBiz > 1 ? 's' : ''}</span>
              </div>
              {estimate && (
                <>
                  <div className="border-t border-slate-200 my-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Entreprises trouvées</span>
                    <span className="font-bold text-slate-900">{estimate.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Coût total</span>
                    <span className="text-lg font-bold text-amber-700">{estimate.totalCost} crédits</span>
                  </div>
                  {estimate.count === 0 && (
                    <p className="text-xs text-orange-600 font-medium">
                      Aucune entreprise ne correspond à ces filtres. Essayez de les élargir.
                    </p>
                  )}
                  {balance !== null && estimate.totalCost > 0 && estimate.totalCost > balance && (
                    <p className="text-xs text-red-600 font-medium">
                      Solde insuffisant. Vous avez {balance} cr, il faut {estimate.totalCost} cr.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEstimate}
                disabled={estimating || selectedFields.length === 0}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                {estimating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {estimating ? 'Estimation…' : 'Estimer le coût'}
              </button>

              <button
                onClick={handleRunSearch}
                disabled={running || selectedFields.length === 0 || (estimate?.count === 0)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {running ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Lancement…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Lancer la recherche</>
                )}
              </button>
            </div>

            {selectedFields.length === 0 && (
              <p className="text-xs text-slate-400 mt-2 text-center">
                Sélectionnez au moins un champ pour lancer la recherche.
              </p>
            )}
            {selectedFields.length > 0 && !estimate && (
              <p className="text-xs text-slate-400 mt-2 text-center">
                Estimez d&apos;abord pour voir le coût, ou lancez directement.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
