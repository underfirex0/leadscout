'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Download, Lock, Unlock, Loader2,
  AlertCircle, RefreshCw, Building2, CheckCircle
} from 'lucide-react'
import { FIELD_COSTS, FIELD_LABELS, ALL_RESULT_FIELDS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { MaskedBusiness, SearchResult, UnlockResponse } from '@/types'

type UnlockState = {
  [key: string]: 'idle' | 'loading' | 'done' | 'error'
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryId = searchParams.get('queryId')

  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlockState, setUnlockState] = useState<UnlockState>({})
  const [balance, setBalance] = useState<number | null>(null)
  const [exporting, setExporting] = useState(false)

  const loadResults = useCallback(async () => {
    if (!queryId) {
      router.push('/search')
      return
    }

    setLoading(true)
    setError(null)

    // 1. Try sessionStorage first (fastest)
    try {
      const cached = sessionStorage.getItem(`query_${queryId}`)
      if (cached) {
        const data: SearchResult = JSON.parse(cached)
        setResult(data)
        setBalance(data.newBalance)
        setLoading(false)
        return
      }
    } catch {
      // sessionStorage not available or bad JSON
    }

    // 2. Fetch from API (page refresh scenario)
    try {
      const res = await fetch(`/api/search/results?queryId=${queryId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setResult(data)
      setBalance(data.newBalance ?? null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors du chargement des résultats')
    } finally {
      setLoading(false)
    }
  }, [queryId, router])

  useEffect(() => {
    loadResults()
  }, [loadResults])

  async function handleUnlock(businessId: string, field: string) {
    const key = `${businessId}:${field}`
    setUnlockState(s => ({ ...s, [key]: 'loading' }))

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, field }),
      })
      const data: UnlockResponse & { error?: string; available?: number; required?: number } = await res.json()

      if (!res.ok) {
        if (res.status === 402) {
          alert(`Crédits insuffisants : vous avez ${data.available} cr, il en faut ${data.required}.`)
        } else {
          alert(data.error || 'Erreur lors du déverrouillage')
        }
        setUnlockState(s => ({ ...s, [key]: 'error' }))
        return
      }

      // Update the business in the result
      setResult(prev => {
        if (!prev) return prev
        return {
          ...prev,
          businesses: prev.businesses.map(biz =>
            biz.id === businessId
              ? { ...biz, unlocked: { ...biz.unlocked, [field]: data.value } }
              : biz
          ),
          newBalance: data.newBalance ?? prev.newBalance,
        }
      })
      setBalance(data.newBalance ?? balance)
      setUnlockState(s => ({ ...s, [key]: 'done' }))

      // Update sessionStorage
      setResult(prev => {
        if (prev) {
          sessionStorage.setItem(`query_${queryId}`, JSON.stringify(prev))
        }
        return prev
      })
    } catch {
      setUnlockState(s => ({ ...s, [key]: 'error' }))
    }
  }

  async function handleExport() {
    if (!queryId) return
    setExporting(true)
    try {
      const res = await fetch(`/api/export?queryId=${queryId}`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leadscout-export-${queryId.slice(0, 8)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de l\'export')
    } finally {
      setExporting(false)
    }
  }

  function getFieldValue(biz: MaskedBusiness, field: string): string | null {
    if (biz.unlocked?.[field]) return biz.unlocked[field]
    return (biz as Record<string, unknown>)[field] as string | null
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
        <p className="text-slate-500">Chargement des résultats…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <div className="flex gap-3">
          <button onClick={loadResults} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          <Link href="/search" className="btn-primary">Nouvelle recherche</Link>
        </div>
      </div>
    )
  }

  if (!result) return null

  const { businesses, totalCount, creditsSpent, fieldsRequested, filters } = result
  const visibleFields = fieldsRequested.filter(f => FIELD_COSTS[f] !== undefined)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/search" className="btn-secondary p-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {totalCount} résultat{totalCount > 1 ? 's' : ''}
              {filters?.sector ? ` — ${filters.sector}` : ''}
              {filters?.city ? ` · ${filters.city}` : ''}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm text-slate-500">
                {creditsSpent} crédit{creditsSpent > 1 ? 's' : ''} dépensés
              </span>
              {balance !== null && (
                <span className="text-sm text-amber-700 font-medium">
                  ◆ Solde : {balance.toLocaleString()} cr
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting || businesses.length === 0}
          className="btn-secondary flex items-center gap-2 self-start"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Exporter CSV
        </button>
      </div>

      {businesses.length === 0 ? (
        <div className="card p-16 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">Aucune entreprise ne correspond à ces critères.</p>
          <Link href="/search" className="btn-primary">Modifier les filtres</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Raison sociale</th>
                  <th>Secteur</th>
                  <th>Ville</th>
                  {ALL_RESULT_FIELDS.map(field => (
                    <th key={field}>
                      <div className="flex items-center gap-1">
                        {FIELD_LABELS[field] || field}
                        {!visibleFields.includes(field) && (
                          <Lock className="w-3 h-3 text-amber-400" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {businesses.map(biz => (
                  <tr key={biz.id}>
                    <td>
                      <p className="font-semibold text-slate-900 whitespace-nowrap">{biz.name}</p>
                      {biz.legal_form && (
                        <p className="text-xs text-slate-400">{biz.legal_form}</p>
                      )}
                    </td>
                    <td>
                      <span className="badge-slate whitespace-nowrap text-xs">{biz.sector}</span>
                    </td>
                    <td className="whitespace-nowrap">{biz.city}</td>

                    {ALL_RESULT_FIELDS.map(field => {
                      const value = getFieldValue(biz, field)
                      const unlockKey = `${biz.id}:${field}`
                      const state = unlockState[unlockKey] || 'idle'
                      const cost = FIELD_COSTS[field]
                      const isPaid = visibleFields.includes(field)

                      if (value) {
                        // Field is visible (either from query or individual unlock)
                        return (
                          <td key={field}>
                            <div className="flex items-center gap-1.5">
                              {biz.unlocked?.[field] && (
                                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                              )}
                              <span className="font-mono text-xs text-slate-700 whitespace-nowrap">
                                {value}
                              </span>
                            </div>
                          </td>
                        )
                      }

                      // Field is locked
                      return (
                        <td key={field}>
                          <button
                            onClick={() => handleUnlock(biz.id, field)}
                            disabled={state === 'loading'}
                            className={cn(
                              'inline-flex items-center gap-1.5 text-xs font-medium rounded-md px-2 py-1 transition-all',
                              state === 'loading'
                                ? 'text-slate-400 bg-slate-100 cursor-wait'
                                : state === 'error'
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer'
                            )}
                            title={`Déverrouiller pour ${cost} crédit${cost > 1 ? 's' : ''}`}
                          >
                            {state === 'loading' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Lock className="w-3 h-3" />
                            )}
                            {state === 'loading' ? '…' : state === 'error' ? 'Erreur' : `${cost} cr`}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalCount > businesses.length && (
            <div className="px-6 py-4 border-t border-slate-100 text-sm text-slate-500 text-center">
              Affichage de {businesses.length} sur {totalCount} résultats.
              Affinez vos filtres pour voir des résultats plus ciblés.
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-400 flex-wrap">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          Champ déverrouillé à la carte
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          Cliquer pour déverrouiller (crédits déduits instantanément)
        </div>
      </div>
    </div>
  )
}
