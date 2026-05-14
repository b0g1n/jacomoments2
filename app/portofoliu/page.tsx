import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Dynamically import components
const Gallery = dynamic(() => import('@/components/Gallery'))
const Navigation = dynamic(() => import('@/components/Navigation'))
const Footer = dynamic(() => import('@/components/Footer'))

export const metadata: Metadata = {
  title: 'Portofoliu | Jaco Moments - Fotograf Nuntă',
  description: 'Galerie foto completă cu nunți, botezuri și ședințe foto. Moment autentice și emoții capturate.',
  keywords: 'portofoliu fotograf nuntă, galerie foto, fotograf profesionist',
  openGraph: {
    title: 'Portofoliu | Jaco Moments - Fotograf Nuntă',
    description: 'Galerie foto cu momente autentice de la nunți și evenimente',
    type: 'website',
    locale: 'ro_RO',
  },
}

export default function PortfolioPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-primary text-secondary">
        <Gallery />
      </main>
      <Footer />
    </>
  )
}
