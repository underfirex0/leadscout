'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, Lock, Download, Users2, Zap, ChevronDown, CheckCircle,
  ArrowRight, Star, Shield, Phone, Mail, Building2, TrendingUp,
  Target, BarChart3, MapPin, Quote, Menu, X, Sparkles, Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Nav ────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links = [
    { href: '#fonctionnalites', label: 'Fonctionnalités' },
    { href: '#tarifs', label: 'Tarifs' },
    { href: '#faq', label: 'FAQ' },
  ]
  return (
    <nav className={cn('fixed top-0 inset-x-0 z-50 transition-all duration-300', scrolled ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-white/5 py-3' : 'py-5')}>
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight" style={{fontFamily:'Syne,sans-serif'}}>LeadScout</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => <a key={l.href} href={l.href} className="text-sm text-white/60 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all">{l.label}</a>)}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">Connexion</Link>
          <Link href="/register" className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-200">Commencer gratuitement</Link>
        </div>
        <button className="md:hidden text-white/70 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0A0F1E] border-t border-white/5 px-5 py-4 space-y-3">
          {links.map(l => <a key={l.href} href={l.href} className="block text-white/70 py-2 text-sm" onClick={() => setOpen(false)}>{l.label}</a>)}
          <div className="pt-2 space-y-2 border-t border-white/5">
            <Link href="/login" className="block text-center text-sm text-white/70 py-2.5 rounded-xl border border-white/10">Connexion</Link>
            <Link href="/register" className="block text-center text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-2.5 rounded-xl">Commencer gratuitement</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ─── Product Mockup ─────────────────────────────────────── */
function Mockup() {
  const rows = [
    { name: 'BATIPRO MAROC SARL', city: 'Casablanca', phone: '0522-45-67-89', email: 'contact@batipro.ma', dir: null },
    { name: 'TECHWAVE MAROC SA',  city: 'Casablanca', phone: '0522-67-89-01', email: null, dir: 'Y. Tahiri' },
    { name: 'ATLAS TRADING SARL', city: 'Casablanca', phone: null, email: null, dir: null },
    { name: 'EXPORTMA SARL',      city: 'Agadir',     phone: '0528-88-99-11', email: 'contact@exportma.ma', dir: 'N. Ait Ahmed' },
  ]
  const Locked = ({ cost }: { cost: string }) => (
    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md font-semibold">
      <Lock className="w-2.5 h-2.5" />{cost}
    </span>
  )
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0D1525] shadow-2xl shadow-black/50 animate-float">
        <div className="bg-[#0A0F1C] px-4 py-3 flex items-center gap-2 border-b border-white/5">
          <div className="flex gap-1.5">
            {['bg-red-500/70','bg-amber-500/70','bg-emerald-500/70'].map(c => <div key={c} className={`w-3 h-3 rounded-full ${c}`} />)}
          </div>
          <div className="flex-1 mx-3 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 font-mono">app.leadscout.ma/search</div>
        </div>
        <div className="px-4 pt-4 pb-3 flex gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/50 flex items-center gap-2">
            <Filter className="w-3 h-3 text-white/30" />BTP · Casablanca · 50-99 employés
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl px-3 py-2 text-xs text-white font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />Lancer
          </div>
        </div>
        <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-white/5">
          <div className="grid grid-cols-5 gap-2 px-3 py-2 bg-white/3 border-b border-white/5">
            {['Entreprise','Ville','Tél.','E-mail','Dirigeant'].map(h => (
              <span key={h} className="text-[9px] text-white/25 font-semibold uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 px-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
              <span className="text-[11px] text-white/80 font-medium truncate">{r.name}</span>
              <span className="text-[11px] text-white/40">{r.city}</span>
              <span>{r.phone ? <span className="text-[11px] font-mono text-emerald-400">{r.phone}</span> : <Locked cost="1 cr" />}</span>
              <span>{r.email ? <span className="text-[11px] text-blue-400 truncate">{r.email}</span> : <Locked cost="1 cr" />}</span>
              <span>{r.dir  ? <span className="text-[11px] text-white/50">{r.dir}</span> : <Locked cost="2 cr" />}</span>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex justify-between items-center">
          <span className="text-[11px] text-white/30">30 résultats · 60 cr</span>
          <div className="flex gap-2">
            <div className="text-[11px] text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-lg px-2.5 py-1.5 font-semibold flex items-center gap-1.5">
              <Users2 className="w-3 h-3" />CRM
            </div>
            <div className="text-[11px] text-white/50 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 font-semibold flex items-center gap-1.5">
              <Download className="w-3 h-3" />CSV
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/30 border border-white/20">
        ◆ 83 crédits restants
      </div>
    </div>
  )
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen bg-[#030712] flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-5 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 font-medium animate-fade-in">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              🇲🇦 Intelligence B2B marocaine
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight animate-slide-up delay-100" style={{fontFamily:'Syne,sans-serif'}}>
              Arrêtez de chercher<br />vos prospects.<br />
              <span className="gradient-text">Trouvez-les.</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-lg animate-slide-up delay-200">
              Accédez aux coordonnées de milliers d&apos;entreprises marocaines.
              Filtrez par secteur, ville, effectif. Ne payez que ce que vous utilisez.
            </p>
            <div className="flex flex-wrap gap-3 animate-slide-up delay-300">
              <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 text-sm">
                Commencer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#fonctionnalites" className="inline-flex items-center gap-2 text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-200">
                Voir comment ça marche <ChevronDown className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/35 animate-fade-in delay-400">
              {['Aucune carte bancaire','100 crédits offerts','Données vérifiées'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{t}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block animate-fade-in delay-300"><Mockup /></div>
        </div>
      </div>
    </section>
  )
}

/* ─── Stats ──────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { value: '10 000+', label: 'Entreprises', icon: Building2 },
    { value: '10',      label: 'Secteurs', icon: BarChart3 },
    { value: '14',      label: 'Villes', icon: MapPin },
    { value: '100%',    label: 'Données locales', icon: Target },
  ]
  return (
    <section className="bg-[#060D1A] border-y border-white/5 py-12">
      <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="text-center">
            <Icon className="w-5 h-5 text-indigo-400/60 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white" style={{fontFamily:'Syne,sans-serif'}}>{value}</p>
            <p className="text-sm text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── How it works ───────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n:'01', icon: Filter,   title:'Définissez vos critères', desc:"Secteur, ville, région, effectif. Combinez les filtres pour cibler exactement votre marché cible.", gradient:'from-blue-500 to-indigo-600' },
    { n:'02', icon: Lock,     title:'Choisissez vos données',  desc:"Sélectionnez uniquement les champs dont vous avez besoin. Téléphone, e-mail, dirigeant, CA. Payez à l'usage.",  gradient:'from-violet-500 to-purple-600' },
    { n:'03', icon: Users2,   title:'Prospectez immédiatement', desc:"Exportez en CSV ou gérez vos leads dans le CRM intégré avec suivi des appels, statuts et notes.", gradient:'from-emerald-500 to-teal-600' },
  ]
  return (
    <section id="fonctionnalites" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Comment ça marche</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:'Syne,sans-serif'}}>Simple. Rapide. Efficace.</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">De la recherche au premier appel en moins de 5 minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 relative">
          <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-px bg-gradient-to-r from-indigo-100 via-violet-100 to-emerald-100" />
          {steps.map(({ n, icon: Icon, title, desc, gradient }) => (
            <div key={n} className="text-center group">
              <div className="flex justify-center mb-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-xs font-mono font-semibold text-slate-300 mb-2">{n}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3" style={{fontFamily:'Syne,sans-serif'}}>{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────── */
function Features() {
  const feats = [
    { icon: Search,     title:'Recherche avancée',     desc:"Filtrez par secteur, ville, région, effectif. Prévisualisation du coût en temps réel avant de lancer.",            tag:'Ciblage' },
    { icon: Lock,       title:'Paiement à l\'usage',   desc:"Téléphone à 1 cr, email dirigeant à 5 cr. Ne déboursez que pour ce qui vous est utile. Zéro abonnement.",          tag:'Économique' },
    { icon: Users2,     title:'CRM intégré',           desc:"Statuts d'appel, historique, notes, rappels. Gérez tout votre pipeline sans quitter l'outil.",                    tag:'Productivité' },
    { icon: Download,   title:'Export CSV',            desc:"Compatible Excel, HubSpot, Salesforce. Exportez en un clic, intégrez où vous voulez.",                             tag:'Intégration' },
    { icon: Shield,     title:'Données vérifiées',     desc:"Sources officielles marocaines. Structurées, vérifiées, prêtes à l'emploi. Qualité garantie.",                     tag:'Fiabilité' },
    { icon: Zap,        title:'100 crédits offerts',   desc:"Démarrez sans carte bancaire. 100 crédits = ~50 fiches complètes pour tester sérieusement le produit.",            tag:'Gratuit' },
  ]
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Fonctionnalités</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:'Syne,sans-serif'}}>Tout ce qu&apos;il faut pour prospecter</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">Plus qu&apos;une base de données — un système de prospection complet.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map(({ icon: Icon, title, desc, tag }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{tag}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2" style={{fontFamily:'Syne,sans-serif'}}>{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Field pricing ──────────────────────────────────────── */
function FieldPricing() {
  const rows = [
    { name:'Raison sociale, Secteur, Ville',              cost:'Gratuit', bar:'bg-emerald-500', text:'text-emerald-700', bg:'bg-emerald-50 border-emerald-200' },
    { name:'Téléphone, E-mail, Site web, Adresse',        cost:'1 cr / biz',   bar:'bg-blue-500',    text:'text-blue-700',    bg:'bg-blue-50 border-blue-200' },
    { name:'Effectif, Nom du dirigeant',                   cost:'2 cr / biz',   bar:'bg-indigo-500',  text:'text-indigo-700',  bg:'bg-indigo-50 border-indigo-200' },
    { name:'Téléphone du dirigeant',                       cost:'4 cr / biz',   bar:'bg-violet-500',  text:'text-violet-700',  bg:'bg-violet-50 border-violet-200' },
    { name:"E-mail dirigeant, Chiffre d'affaires",        cost:'5 cr / biz',   bar:'bg-purple-500',  text:'text-purple-700',  bg:'bg-purple-50 border-purple-200' },
  ]
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Tarification des données</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{fontFamily:'Syne,sans-serif'}}>1 crédit = 1 champ, pour 1 entreprise.</h2>
          <p className="text-slate-500">Payez uniquement pour ce que vous débloquez. Rien de plus.</p>
        </div>
        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.name} className={`flex items-center justify-between p-4 rounded-xl border ${r.bg}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${r.bar}`} />
                <span className="text-sm font-medium text-slate-700">{r.name}</span>
              </div>
              <span className={`text-sm font-bold tabular-nums ${r.text}`}>{r.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ────────────────────────────────────────────── */
function Pricing() {
  const packs = [
    { name:'Démarrage', credits:100,   price:'Gratuit',   note:"À l'inscription",  features:['100 crédits offerts','~50 profils complets','Toutes les fonctionnalités','Sans carte bancaire'], cta:'Créer mon compte', href:'/register', hot:false },
    { name:'Starter',   credits:500,   price:'149 MAD',   note:'Paiement unique',  features:['500 crédits','~250 profils complets','Export CSV','CRM intégré'], cta:'Choisir Starter', href:'/register', hot:false },
    { name:'Growth',    credits:2000,  price:'499 MAD',   note:'Paiement unique',  features:['2 000 crédits','~1 000 profils complets','Export CSV','CRM intégré','Support prioritaire'], cta:'Choisir Growth', href:'/register', hot:true },
    { name:'Pro',       credits:10000, price:'1 990 MAD', note:'Paiement unique',  features:['10 000 crédits','~5 000 profils complets','Export CSV','CRM intégré','Support dédié'], cta:'Choisir Pro', href:'/register', hot:false },
    { name:'Entreprise',credits:null,  price:'Sur devis', note:'Facturation mensuelle', features:['Crédits illimités','Multi-utilisateurs','API dédiée','SLA garanti','Onboarding personnalisé'], cta:'Nous contacter', href:'mailto:contact@leadscout.ma', hot:false },
  ]
  return (
    <section id="tarifs" className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="absolute inset-0 hero-glow pointer-events-none opacity-50" />
      <div className="relative max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">Tarifs</p>
          <h2 className="text-4xl font-bold text-white mb-4" style={{fontFamily:'Syne,sans-serif'}}>Commencez gratuitement,<br />évoluez à votre rythme.</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">Pas d&apos;abonnement. Pas de surprise. Achetez quand vous en avez besoin.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {packs.map(p => (
            <div key={p.name} className={cn('rounded-2xl p-5 border flex flex-col transition-all duration-300', p.hot ? 'bg-gradient-to-b from-indigo-600 to-violet-700 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 lg:scale-110' : 'bg-white/5 border-white/10 hover:border-white/20')}>
              {p.hot && <div className="text-xs font-bold text-white bg-white/20 rounded-full px-3 py-1 self-start mb-3">⭐ Populaire</div>}
              <p className={cn('text-xs font-semibold uppercase tracking-widest mb-2', p.hot ? 'text-indigo-200' : 'text-white/40')}>{p.name}</p>
              <p className="text-2xl font-bold text-white mb-0.5" style={{fontFamily:'Syne,sans-serif'}}>{p.price}</p>
              <p className={cn('text-xs mb-1', p.hot ? 'text-indigo-200' : 'text-white/35')}>{p.note}</p>
              {p.credits && <p className={cn('text-sm font-semibold mb-4', p.hot ? 'text-indigo-100' : 'text-white/70')}>{p.credits.toLocaleString()} crédits</p>}
              <ul className="space-y-2 flex-1 mb-5 mt-2">
                {p.features.map(f => (
                  <li key={f} className={cn('flex items-center gap-2 text-xs', p.hot ? 'text-indigo-100' : 'text-white/50')}>
                    <CheckCircle className={cn('w-3.5 h-3.5 shrink-0', p.hot ? 'text-white' : 'text-emerald-400/70')} />{f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={cn('block text-center text-sm font-semibold py-2.5 rounded-xl transition-all', p.hot ? 'bg-white text-indigo-700 hover:bg-indigo-50' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10')}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { quote:"Avant LeadScout, je passais des journées à chercher des contacts. Maintenant j'ai une liste qualifiée en 10 minutes.", name:'Karim Benali', role:'Directeur Commercial, IT · Casablanca' },
    { quote:"Le système de crédits est très intelligent. Je ne paie que les coordonnées des prospects qui m'intéressent vraiment.", name:'Nadia Alaoui',  role:"Fondatrice, Agence communication · Rabat" },
    { quote:"Le CRM intégré est un vrai bonus. Je gère tout mon pipeline de prospection directement dans l'outil.", name:'Youssef El Fassi', role:'Business Developer, Fintech · Casablanca' },
  ]
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Témoignages</p>
          <h2 className="text-4xl font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>Ils ont trouvé leurs prospects</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(({ quote, name, role }) => (
            <div key={name} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <Quote className="w-6 h-6 text-indigo-300 mb-4" />
              <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm" style={{fontFamily:'Syne,sans-serif'}}>{name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{role}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState<number|null>(null)
  const faqs = [
    { q:"Qu'est-ce qu'un crédit LeadScout ?", a:"Un crédit vous permet de débloquer un champ de données pour une entreprise. Numéro de téléphone = 1 crédit, email dirigeant = 5 crédits. Les informations de base (nom, secteur, ville) sont toujours gratuites." },
    { q:"Les données sont-elles à jour et fiables ?", a:"Nos données proviennent de sources officielles marocaines et sont régulièrement vérifiées. Nous privilégions la qualité à la quantité pour vous garantir des coordonnées exploitables." },
    { q:"Y a-t-il un abonnement mensuel ?", a:"Non. LeadScout fonctionne uniquement à l'usage. Vous achetez des crédits une fois, ils n'expirent pas. Aucun renouvellement automatique." },
    { q:"Puis-je exporter les données ?", a:"Oui. Toutes vos données débloquées sont exportables en CSV depuis la page des résultats ou le CRM. Compatible Excel, HubSpot, Salesforce." },
    { q:"Comment fonctionne le CRM intégré ?", a:"Après une recherche, ajoutez des leads au CRM. Gérez-y statuts (à appeler, intéressé, converti…), appelez directement, loguez les résultats et ajoutez des notes." },
    { q:"Suis-je débité deux fois pour un même contact ?", a:"Jamais. Si vous avez déjà débloqué le téléphone d'une entreprise, il s'affichera automatiquement sans déduire de crédits supplémentaires." },
  ]
  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>Questions fréquentes</h2>
        </div>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className={cn('bg-white rounded-2xl border overflow-hidden transition-all duration-200', open===i ? 'border-indigo-200 shadow-sm' : 'border-slate-200')}>
              <button onClick={() => setOpen(open===i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                <span className={cn('font-semibold text-sm', open===i ? 'text-indigo-700' : 'text-slate-900')} style={{fontFamily:'Syne,sans-serif'}}>{q}</span>
                <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform duration-200', open===i ? 'rotate-180 text-indigo-500' : 'text-slate-400')} />
              </button>
              {open===i && (
                <div className="px-6 pb-5 animate-slide-down">
                  <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-5 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-indigo-200 font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />Sans engagement · Sans carte bancaire
        </div>
        <h2 className="text-5xl font-bold text-white mb-5 leading-tight" style={{fontFamily:'Syne,sans-serif'}}>
          Prêt à prospecter<br />intelligemment ?
        </h2>
        <p className="text-xl text-indigo-200 mb-10 max-w-lg mx-auto">
          Rejoignez LeadScout et recevez 100 crédits gratuits pour démarrer maintenant.
        </p>
        <Link href="/register" className="inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 text-base">
          Créer mon compte gratuitement <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-indigo-300/60 text-sm mt-5">100 crédits offerts · Aucune carte bancaire requise</p>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#030712] border-t border-white/5 py-14">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg" style={{fontFamily:'Syne,sans-serif'}}>LeadScout</span>
            </div>
            <p className="text-sm text-white/35 leading-relaxed">La base de données B2B marocaine. Prospectez avec précision.</p>
          </div>
          {[
            { title:'Produit',  links:[{l:'Fonctionnalités',h:'#fonctionnalites'},{l:'Tarifs',h:'#tarifs'},{l:'FAQ',h:'#faq'}] },
            { title:'Compte',   links:[{l:'Se connecter',h:'/login'},{l:'Créer un compte',h:'/register'},{l:'Dashboard',h:'/dashboard'}] },
            { title:'Contact',  links:[{l:'contact@leadscout.ma',h:'mailto:contact@leadscout.ma'},{l:'support@leadscout.ma',h:'mailto:support@leadscout.ma'}] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map(lk => (
                  <li key={lk.l}><Link href={lk.h} className="text-sm text-white/40 hover:text-white transition-colors">{lk.l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">© {new Date().getFullYear()} LeadScout. Tous droits réservés. · Maroc</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/25 cursor-pointer hover:text-white/50 transition-colors">Confidentialité</span>
            <span className="text-xs text-white/25 cursor-pointer hover:text-white/50 transition-colors">CGU</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <Nav />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <FieldPricing />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
