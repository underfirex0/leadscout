'use client'

import { useState, FormEvent, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, AlertCircle, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message
      )
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">Adresse e-mail</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="input" placeholder="vous@exemple.com" required autoComplete="email" />
      </div>
      <div>
        <label htmlFor="password" className="label">Mot de passe</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="input" placeholder="••••••••" required autoComplete="current-password" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Connexion en cours…</> : 'Se connecter'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">LeadScout</span>
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Connexion</h1>
          <p className="text-sm text-slate-500 mb-8">
            Pas encore inscrit ?{' '}
            <Link href="/register" className="text-brand-600 font-medium hover:underline">Créer un compte</Link>
          </p>
          <Suspense fallback={<div className="h-48 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/" className="hover:text-slate-600">← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </div>
  )
}
