import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AboutSection from '@/components/AboutSection'

export const metadata: Metadata = {
  title: 'Despre | Jaco Moments - Fotograf Nuntă',
  description: 'Cine este Jaco Moments - fotograf de evenimente, pasionat de capturarea momentelor unice. Află povestea și stilul fotografic.',
  keywords: 'despre fotograf, fotograf nuntă',
  openGraph: {
    title: 'Despre | Jaco Moments - Fotograf Nuntă',
    description: 'Află povestea și pasiunea pentru fotografia de evenimente',
    type: 'website',
    locale: 'ro_RO',
  },
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-primary text-secondary">
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}
