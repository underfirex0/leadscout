'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Search, LayoutDashboard, Wallet, LogOut,
  ChevronDown, Users2, Crown, Calendar
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { Profile } from '@/types'
import { cn } from '@/lib/utils'

interface NavbarProps { profile: Profile }

export default function Navbar({ profile }: NavbarProps) {
  const pathname    = usePathname()
  const router      = useRouter()
  const [open, setOpen] = useState(false)
  const [credits, setCredits] = useState(profile.credit_balance)
  const dropRef     = useRef<HTMLDivElement>(null)
  const supabase    = createClient()

  useEffect(() => { setCredits(profile.credit_balance) }, [profile.credit_balance])
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/'); router.refresh()
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    { href: '/search',    label: 'Recherche',   icon: Search },
    { href: '/crm',       label: 'CRM',         icon: Users2 },
    { href: '/meetings',  label: 'Meetings',    icon: Calendar },
  ]

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight hidden sm:block">LeadScout</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5 overflow-x-auto">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              isActive(href)
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}

          {/* MeetMaster — distinct amber style */}
          <Link href="/meetmaster" className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
            isActive('/meetmaster') || isActive('/master')
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
          )}>
            <Crown className="w-4 h-4" />
            <span className="hidden sm:block">MeetMaster</span>
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Credits */}
          <Link href="/wallet"
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-2.5 py-1.5 text-sm font-semibold hover:bg-amber-100 transition-colors">
            <span className="text-amber-500 text-xs">◆</span>
            <span className="font-mono">{credits.toLocaleString()}</span>
            <span className="text-amber-600/70 text-xs hidden sm:block">cr</span>
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={dropRef}>
            <button onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 rounded-lg hover:bg-slate-100 px-2 py-1.5 transition-colors">
              <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center">
                <span className="text-brand-700 font-bold text-xs">
                  {(profile.full_name || profile.email || 'U')[0].toUpperCase()}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1 w-56 card shadow-lg border border-slate-200 py-1 z-50 animate-fade-in">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="font-semibold text-sm text-slate-900 truncate">{profile.full_name || 'Utilisateur'}</p>
                  <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                </div>
                <div className="py-1">
                  {[
                    { href: '/meetmaster', label: 'MeetMaster', icon: Crown },
                    { href: '/master', label: 'Mon profil Master', icon: Crown },
                    { href: '/meetings', label: 'Mes meetings', icon: Calendar },
                    { href: '/crm', label: 'Mon CRM', icon: Users2 },
                    { href: '/wallet', label: 'Mes crédits', icon: Wallet },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setOpen(false)}>
                      <Icon className="w-4 h-4 text-slate-400" />{label}
                    </Link>
                  ))}
                  <button onClick={signOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1">
                    <LogOut className="w-4 h-4" /> Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
