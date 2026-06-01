'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, LayoutDashboard, Wallet, LogOut, User, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { Profile } from '@/types'
import { cn } from '@/lib/utils'

interface NavbarProps {
  profile: Profile
}

export default function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [credits, setCredits] = useState(profile.credit_balance)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Subscribe to real-time credit balance updates
  useEffect(() => {
    setCredits(profile.credit_balance)
  }, [profile.credit_balance])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Nouvelle recherche', icon: Search },
    { href: '/wallet', label: 'Crédits', icon: Wallet },
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight hidden sm:block">LeadScout</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Credit badge */}
          <Link
            href="/wallet"
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-amber-100 transition-colors"
          >
            <span className="text-amber-500">◆</span>
            <span className="font-mono">{credits.toLocaleString()}</span>
            <span className="text-amber-600/70 text-xs hidden sm:block">crédits</span>
          </Link>

          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg hover:bg-slate-100 px-2 py-1.5 transition-colors"
            >
              <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center">
                <span className="text-brand-700 font-bold text-xs">
                  {(profile.full_name || profile.email || 'U')[0].toUpperCase()}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 card shadow-lg border border-slate-200 py-1 z-50 animate-fade-in">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="font-semibold text-sm text-slate-900 truncate">{profile.full_name || 'Utilisateur'}</p>
                  <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/wallet"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Wallet className="w-4 h-4 text-slate-400" />
                    Mes crédits
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
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
