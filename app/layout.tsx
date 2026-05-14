import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans, Cormorant_Garamond, Cinzel } from 'next/font/google'
import './globals.css'
import { LayoutClient } from '@/components/LayoutClient'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-playfair',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plusjakarta',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cinzel',
})

export const metadata: Metadata = {
  title: 'Jaco Moments | Fotograf Nuntă Premium Timișoara',
  description: 'Fotograf profesionist nuntă în Timișoara, România. Capturăm cele mai frumoase momente ale evenimentului tău cu stil cinematic și premium. 2 ani experiență, 12 evenimente acoperite.',
  keywords: 'fotograf nuntă Timișoara, foto nuntă, video nuntă, fotograf profesionist, nuntă romania, wedding photography Timisoara',
  openGraph: {
    title: 'Jaco Moments | Fotograf Nuntă Premium Timișoara',
    description: 'Capturăm momentele unice ale evenimentului tău în Timișoara. Stil cinematic, atenție la detalii, rezultate spectaculoase.',
    type: 'website',
    locale: 'ro_RO',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaco Moments | Fotograf Nuntă Premium Timișoara',
    description: 'Fotograf profesionist evenimente în Timișoara. Stil cinematic și premium.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Jaco Moments',
    description: 'Fotograf profesionist nuntă și evenimente în Timișoara, România',
    url: 'https://jaccomoments.ro',
    telephone: '+40 730 876 987',
    email: 'jacomoments@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Timișoara',
      addressRegion: 'Timiș',
      addressCountry: 'RO',
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.instagram.com/jacomoments',
      'https://www.facebook.com/people/JacoMoments/61584043523601/',
    ],
  }

  return (
    <html lang="ro" className={`${playfair.variable} ${cormorant.variable} ${plusJakarta.variable} ${cinzel.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
