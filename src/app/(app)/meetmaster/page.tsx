'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Crown, Star, MapPin, Search, ChevronRight,
  CheckCircle, Users, Calendar, Loader2, Filter, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Master } from '@/types'

const ROLES = ['DRH','DAF','Directeur des Achats','Directrice des Achats',
  'DG / CEO','Directeur Commercial','DSI','Directeur Marketing','Directrice des RH']
const SECTORS = ['Industrie & Manufacturing','Services Financiers','Grande Distribution',
  'Technologies de l\'information','Santé & Pharma','BTP & Construction',
  'FMCG & Agroalimentaire','Immobilier & Construction']
const CITIES = ['Casablanca','Rabat','Tanger','Marrakech','Agadir','Fès']

function RoleIcon({ role }: { role: string }) {
  const colors: Record<string, string> = {
    'DRH': 'from-rose-500 to-pink-600',
    'Directrice des RH': 'from-rose-500 to-pink-600',
    'DAF': 'from-blue-500 to-indigo-600',
    'DG / CEO': 'from-amber-500 to-orange-600',
    'Directeur des Achats': 'from-emerald-500 to-teal-600',
    'Directrice des Achats': 'from-emerald-500 to-teal-600',
    'DSI': 'from-violet-500 to-purple-600',
    'Directeur Commercial': 'from-cyan-500 to-blue-600',
    'Directeur Marketing': 'from-fuchsia-500 to-pink-600',
  }
  const gradient = colors[role] || 'from-slate-500 to-slate-700'
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white text-sm font-bold w-full h-full flex items-center justify-center`}>
      {role.split(' ').map(w => w[0]).join('').slice(0, 3)}
    </div>
  )
}

function MasterCard({ master }: { master: Master }) {
  const initials = master.display_name.split(' ').map(w => w[0]).join('').toUpperCase()
  return (
    <Link href={`/meetmaster/${master.id}`}
      className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, rgba(251,191,36,0.4), transparent 70%)' }} />
        {master.is_verified && (
          <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" /> Vérifié
          </div>
        )}
        <div className="absolute -bottom-8 left-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
            <RoleIcon role={master.role} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-10 px-5 pb-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-slate-900 text-base leading-tight" style={{fontFamily:'Syne,sans-serif'}}>
            {master.display_name}
          </h3>
          <p className="text-sm text-indigo-600 font-semibold mt-0.5">{master.role}</p>
          {master.company_sector && (
            <p className="text-xs text-slate-500 mt-0.5">{master.company_sector}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3">
          {master.average_rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-800">{master.average_rating}</span>
            </div>
          )}
          {master.meetings_completed > 0 && (
            <span className="text-xs text-slate-400">{master.meetings_completed} meetings</span>
          )}
          {master.city && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />{master.city}
            </div>
          )}
        </div>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
          {master.expertise.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {master.expertise.length > 3 && (
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              +{master.expertise.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">{master.max_meetings_per_month} meetings/mois</p>
            <p className="font-bold text-slate-900 text-sm">1 000 MAD<span className="text-xs text-slate-400 font-normal"> / 30 min</span></p>
          </div>
          <div className="w-8 h-8 bg-amber-50 group-hover:bg-amber-400 rounded-xl flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-amber-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function MeetMasterPage() {
  const [masters, setMasters] = useState<Master[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  useEffect(() => {
    fetch('/api/meetmaster/masters')
      .then(r => r.json())
      .then(d => setMasters(d.masters ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => masters.filter(m => {
    if (roleFilter   && m.role !== roleFilter) return false
    if (sectorFilter && m.company_sector !== sectorFilter) return false
    if (cityFilter   && m.city !== cityFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return m.display_name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.expertise.some(e => e.toLowerCase().includes(q)) ||
        (m.company_sector?.toLowerCase().includes(q) ?? false)
    }
    return true
  }), [masters, search, roleFilter, sectorFilter, cityFilter])

  const hasFilters = search || roleFilter || sectorFilter || cityFilter

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(251,191,36,0.4), transparent 60%)' }} />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-4 py-1.5 text-sm text-amber-300 font-semibold mb-5">
              <Crown className="w-4 h-4" /> MeetMaster
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3" style={{fontFamily:'Syne,sans-serif'}}>
              Rencontrez les décideurs<br />qui transforment votre business.
            </h1>
            <p className="text-white/50 text-lg max-w-xl">
              30 minutes avec un DRH, DAF ou Directeur Achats qualifié.
              Benchmark, insights, réseau — 1 000 MAD par meeting.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-white" style={{fontFamily:'Syne,sans-serif'}}>{masters.length}</p>
              <p className="text-white/50 text-sm">Masters disponibles</p>
            </div>
            <Link href="/meetmaster/apply"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold px-5 py-3 rounded-xl text-sm text-center hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all">
              Devenir Master →
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Search, label: 'Choisissez un Master', desc: 'Filtrez par rôle, secteur ou ville', color: 'text-indigo-600 bg-indigo-50' },
          { icon: Calendar, label: 'Proposez un créneau', desc: '3 dates de préférence pour 30 min', color: 'text-amber-600 bg-amber-50' },
          { icon: Sparkles, label: 'Rencontrez-vous', desc: 'Meeting visio confirmé sous 24h', color: 'text-emerald-600 bg-emerald-50' },
        ].map(({ icon: Icon, label, desc, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>{label}</p>
            <p className="text-xs text-slate-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un Master…"
              className="input pl-9 text-sm" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input w-auto text-sm min-w-36">
            <option value="">Tous les rôles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="input w-auto text-sm min-w-40">
            <option value="">Tous les secteurs</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="input w-auto text-sm min-w-32">
            <option value="">Toutes les villes</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setRoleFilter(''); setSectorFilter(''); setCityFilter('') }}
              className="btn-ghost text-sm text-slate-400">
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Crown className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-2">Aucun Master trouvé.</p>
          <button onClick={() => { setSearch(''); setRoleFilter(''); setSectorFilter(''); setCityFilter('') }}
            className="btn-secondary text-sm mt-2">Effacer les filtres</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filtered.length}</span> Master{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(master => (
              <MasterCard key={master.id} master={master} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
