import Link from 'next/link'
import {
  Search, Shield, Zap, Database, ChevronRight,
  Building2, Phone, Mail, Users, TrendingUp, Lock
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">LeadScout</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost">Connexion</Link>
            <Link href="/register" className="btn-primary">
              Démarrer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-50 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-sm font-medium text-brand-700 mb-8">
            <Zap className="w-3.5 h-3.5" />
            +200 entreprises marocaines en base
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Trouvez vos prochains{' '}
            <span className="text-brand-600">clients B2B</span>{' '}
            en quelques secondes
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Accédez à la base de données des entreprises marocaines. Filtrez par secteur, ville,
            effectif et débloquez uniquement les contacts dont vous avez besoin.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register" className="btn-primary text-base px-6 py-3 flex items-center gap-2">
              Commencer — 100 crédits offerts
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-secondary text-base px-6 py-3">
              Déjà inscrit ? Connexion
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-400">Aucune carte bancaire requise</p>
        </div>
      </section>

      {/* Preview table */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card overflow-hidden shadow-lg border-0 ring-1 ring-slate-200">
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-slate-400 text-xs font-mono">leadscout.ma — Résultats de recherche</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Raison sociale</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Secteur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Ville</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Téléphone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">E-mail</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Dirigeant</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'BATIPRO MAROC SARL', sector: 'BTP & Construction', city: 'Casablanca', phone: '0522-45-67-89', email: 'contact@batipro.ma', locked: false },
                    { name: 'TECHWAVE MAROC SA', sector: 'Technologies de l\'info', city: 'Casablanca', phone: null, email: null, locked: true },
                    { name: 'ATLAS TRADING SARL', sector: 'Import / Export', city: 'Casablanca', phone: '0522-22-33-44', email: 'atlastrading@...', locked: false },
                    { name: 'CONSERVES DU SOUSS', sector: 'Agro-alimentaire', city: 'Agadir', phone: null, email: null, locked: true },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="badge-slate">{row.sector}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.city}</td>
                      <td className="px-4 py-3">
                        {row.locked ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            Déverrouiller · 1 cr
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-slate-700">{row.phone}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.locked ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            Déverrouiller · 1 cr
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-slate-700">{row.email}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                          <Lock className="w-3 h-3" />
                          Déverrouiller · 2 cr
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Tout ce qu'il vous faut pour prospecter
            </h2>
            <p className="text-lg text-slate-500">
              Payez uniquement pour les données dont vous avez besoin
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'Recherche avancée',
                desc: 'Filtrez par secteur d\'activité, ville, région et taille d\'effectif pour cibler exactement les bons prospects.',
              },
              {
                icon: Lock,
                title: 'À la carte',
                desc: 'Sélectionnez les champs qui vous intéressent (téléphone, email, dirigeant…) et ne payez que ce que vous débloquez.',
              },
              {
                icon: Database,
                title: 'Export CSV',
                desc: 'Exportez vos résultats en CSV et importez-les directement dans votre CRM ou votre outil de prospection.',
              },
              {
                icon: Shield,
                title: 'Données vérifiées',
                desc: 'Données d\'entreprises marocaines issues de sources officielles, structurées et prêtes à l\'emploi.',
              },
              {
                icon: Building2,
                title: 'Toutes les informations',
                desc: 'Nom, secteur, adresse, effectif, chiffre d\'affaires, nom et contact du dirigeant — tout y est.',
              },
              {
                icon: TrendingUp,
                title: 'Crédits flexibles',
                desc: 'Commencez avec 100 crédits offerts. Chaque champ débloqué coûte entre 1 et 5 crédits. Aucun abonnement.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Tarification transparente</h2>
          <p className="text-lg text-slate-500 mb-12">Un crédit = un champ pour une entreprise</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { fields: 'Raison sociale, Secteur, Ville', cost: 'Gratuit', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { fields: 'Téléphone, E-mail, Adresse, Site web', cost: '1 cr / biz', color: 'bg-brand-50 border-brand-200 text-brand-700' },
              { fields: 'Effectif, Nom dirigeant', cost: '2 cr / biz', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { fields: 'Tél. dirigeant', cost: '4 cr / biz', color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { fields: 'E-mail dirigeant, CA', cost: '5 cr / biz', color: 'bg-red-50 border-red-200 text-red-700' },
            ].map(({ fields, cost, color }) => (
              <div key={cost} className={`rounded-xl p-4 border ${color} text-left`}>
                <div className="text-2xl font-bold mb-1">{cost}</div>
                <div className="text-sm opacity-75">{fields}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à trouver vos prochains clients ?
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            Inscrivez-vous gratuitement et recevez 100 crédits pour démarrer.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
            Créer mon compte gratuitement
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
              <Search className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-700">LeadScout</span>
            <span>· B2B Business Intelligence au Maroc</span>
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} LeadScout. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
