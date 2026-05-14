import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PricingSection from '@/components/PricingSection'

export const metadata: Metadata = {
  title: 'Pachete și Prețuri | Jaco Moments - Fotograf Nuntă',
  description: 'Pachete foto de nuntă accesibile: de la 400€ la 900€. Fotografie completă, albume premium, ședințe logodnă. Prețuri transparente.',
  keywords: 'prețuri fotograf nuntă, pachete foto, fotograf nuntă, costuri fotografie',
  openGraph: {
    title: 'Pachete și Prețuri | Jaco Moments - Fotograf Nuntă',
    description: 'Pachete foto accesibile și prețuri transparente',
    type: 'website',
    locale: 'ro_RO',
  },
}

export default function PackagesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-primary text-secondary">
        <PricingSection />
      </main>
      <Footer />
    </>
  )
}
