import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadScout — B2B Business Intelligence au Maroc',
  description:
    'Accédez à la base de données des entreprises marocaines. Cherchez par secteur, ville, effectif et débloquez les contacts dont vous avez besoin.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔍</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
