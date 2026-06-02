import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  ArrowLeft, Star, MapPin, CheckCircle, Crown,
  Calendar, Clock, Building2, Linkedin, ChevronRight
} from 'lucide-react'
import type { Master } from '@/types'

function RoleGradient({ role }: { role: string }) {
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
  return colors[role] || 'from-slate-500 to-slate-700'
}

export default async function MasterProfilePage({ params }: { params: { id: string } }) {
  const { data: master, error } = await supabaseAdmin
    .from('masters')
    .select('*')
    .eq('id', params.id)
    .eq('application_status', 'approved')
    .single()

  if (error || !master) notFound()

  const m = master as Master
  const gradient = RoleGradient({ role: m.role })

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link href="/meetmaster" className="btn-secondary inline-flex items-center gap-2 text-sm">
        <ArrowLeft className="w-4 h-4" /> Tous les Masters
      </Link>

      {/* Profile header */}
      <div className="card overflow-hidden">
        <div className={`h-32 bg-gradient-to-br ${gradient} relative`}>
          <div className="absolute inset-0 opacity-20 grid-bg" />
          {m.is_verified && (
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Master Vérifié
            </div>
          )}
        </div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 -mt-10 mb-6">
            <div className="flex items-end gap-4">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-bold`}>
                {m.display_name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>{m.display_name}</h1>
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-indigo-600 font-semibold">{m.role}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  {m.company_sector && <span>{m.company_sector}</span>}
                  {m.company_size && <span>· {m.company_size}</span>}
                  {m.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />{m.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              {m.average_rating && (
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-2xl font-bold text-slate-900">{m.average_rating}</span>
                  </div>
                  <p className="text-xs text-slate-400">{m.meetings_completed} meetings</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 py-5 border-y border-slate-100 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>30 minutes par meeting</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Jusqu'à {m.max_meetings_per_month} meetings/mois</span>
            </div>
            {m.linkedin_url && (
              <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <Linkedin className="w-4 h-4" /> Profil LinkedIn
              </a>
            )}
          </div>

          {/* Bio */}
          {m.bio && (
            <div className="mb-6">
              <h2 className="font-bold text-slate-900 mb-2" style={{fontFamily:'Syne,sans-serif'}}>À propos</h2>
              <p className="text-slate-600 leading-relaxed">{m.bio}</p>
            </div>
          )}

          {/* Expertise */}
          {m.expertise.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold text-slate-900 mb-3" style={{fontFamily:'Syne,sans-serif'}}>Expertises</h2>
              <div className="flex flex-wrap gap-2">
                {m.expertise.map((tag: string) => (
                  <span key={tag} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {m.topics.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 mb-3" style={{fontFamily:'Syne,sans-serif'}}>
                Ce que vous apprendrez
              </h2>
              <ul className="space-y-2">
                {m.topics.map((topic: string) => (
                  <li key={topic} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Booking CTA */}
      <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1" style={{fontFamily:'Syne,sans-serif'}}>
              Réserver un meeting avec {m.display_name}
            </h3>
            <p className="text-slate-600 text-sm">
              30 minutes · Visioconférence · Réponse sous 24h
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-2xl font-bold text-slate-900">1 000 MAD</p>
                <p className="text-xs text-slate-400">Facturation après confirmation</p>
              </div>
            </div>
          </div>
          <Link href={`/meetmaster/book/${m.id}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold px-8 py-4 rounded-2xl hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap">
            Réserver ce meeting
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
