'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Import components dynamically to avoid SSR issues with LanguageContext
const Navigation = dynamic(() => import('@/components/Navigation'))
const HeroSection = dynamic(() => import('@/components/HeroSection'))
const GalleryPreview = dynamic(() => import('@/components/GalleryPreview'))
const AboutSection = dynamic(() => import('@/components/AboutSection'))
const PricingSection = dynamic(() => import('@/components/PricingSection'))
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'))
const ContactSection = dynamic(() => import('@/components/ContactSection'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function HomePage() {
  return (
    <main className="min-h-screen bg-primary text-secondary overflow-hidden">
      <div className="fixed inset-0 pointer-events-none geometric-pattern opacity-30" />
      <div className="fixed inset-0 pointer-events-none geometric-dots opacity-20" />

      <Navigation />
      <HeroSection />
      <GalleryPreview />
      <AboutSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
