'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Package {
  id: string
  name: string
  category: string
  categoryTitle: string
  price: number
  duration: string
  features: string[]
  isPopular: boolean
  order: number
}

interface PackageCategory {
  key: string
  title: string
  packages: Package[]
}

// Fallback data in case API fails
const fallbackPricingData = {
  title: 'Investiție',
  subtitle: 'Pachete și Prețuri',
  description: 'Alege pachetul perfect pentru evenimentul tău. Toate pachetele includ editare profesională și galerie online.',
  select: 'SELECTEAZĂ',
  additionalInfo: 'Toate prețurile sunt în EUR și nu includ transport. Pentru evenimente în afara orașului, se adaugă costuri de transport și cazare după caz.',
  requestCustom: 'CERE OFERTĂ PERSONALIZATĂ',
  extras: {
    title: 'EXTRA OPȚIONALE',
    items: [
      'Album foto premium',
      'Fotografii printate',
      'Reel cinematic pentru social media',
      'Livrare rapidă',
      'Photo corner setup',
    ],
  },
}

function groupPackages(packages: Package[]): PackageCategory[] {
  const grouped: { [key: string]: PackageCategory } = {}

  packages.forEach((pkg) => {
    if (!grouped[pkg.category]) {
      grouped[pkg.category] = {
        key: pkg.category,
        title: pkg.categoryTitle,
        packages: [],
      }
    }
    grouped[pkg.category].packages.push(pkg)
  })

  return Object.values(grouped)
}

export default function PricingSection() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<PackageCategory[]>([])
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages')
        if (!res.ok) throw new Error('Failed to fetch packages')
        const data: Package[] = await res.json()

        if (data && data.length > 0) {
          const grouped = groupPackages(data)
          setCategories(grouped)
          setActiveCategoryKey(grouped[0]?.key || null)
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const activeCategory = categories.find((c) => c.key === activeCategoryKey)

  if (loading) {
    return (
      <section id="pachete" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block w-12 h-12 border-4 border-secondary border-t-accent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section id="pachete" className="relative py-32 px-4">
      {/* Geometric Background */}
      <div className="absolute inset-0 geometric-dots opacity-20" />
      <div className="absolute inset-0 geometric-lines opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="elegant text-3xl md:text-4xl text-accent mb-4">{fallbackPricingData.title}</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">{fallbackPricingData.subtitle}</h2>
          <div className="w-24 h-px bg-secondary mx-auto mb-6" />
          <p className="text-secondary/70 max-w-2xl mx-auto">
            {fallbackPricingData.description}
          </p>
        </motion.div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategoryKey(cat.key)}
                className={`px-6 py-3 border transition-all duration-300 tracking-widest text-sm ${
                  activeCategoryKey === cat.key
                    ? 'bg-secondary text-primary border-secondary'
                    : 'border-secondary/30 hover:border-secondary'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </motion.div>
        )}

        {/* Pricing Cards */}
        <AnimatePresence mode="wait">
          {activeCategory ? (
            <motion.div
              key={activeCategory.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {activeCategory.packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 border transition-all duration-500 ${
                    pkg.isPopular
                      ? 'border-secondary bg-secondary/5 scale-105'
                      : 'border-secondary/20 hover:border-secondary/40'
                  }`}
                >
                  {pkg.isPopular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-secondary text-primary text-sm tracking-widest"
                    >
                      POPULAR
                    </motion.div>
                  )}

                  {/* Geometric Corner Decorations */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-secondary/30" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-secondary/30" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-secondary/30" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-secondary/30" />

                  <h3 className="font-serif text-2xl mb-4 tracking-wider">{pkg.name}</h3>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-light">{pkg.price}</span>
                      <span className="ml-2 text-secondary/60">€</span>
                    </div>
                    <div className="text-sm text-secondary/60 mt-1">{pkg.duration}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start space-x-3 text-sm text-secondary/80"
                      >
                        <div className="w-1 h-1 bg-secondary mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <a href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 border transition-all duration-300 tracking-widest text-sm ${
                        pkg.isPopular
                          ? 'bg-secondary text-primary border-secondary hover:bg-accent'
                          : 'border-secondary/40 hover:border-secondary hover:bg-secondary hover:text-primary'
                      }`}
                    >
                      {fallbackPricingData.select}
                    </motion.button>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 text-secondary/60">
              <p>Nu există pachete de prețuri disponibile momentan.</p>
            </div>
          )}
        </AnimatePresence>

        {/* Extra Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="font-serif text-2xl mb-8">{fallbackPricingData.extras.title}</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {fallbackPricingData.extras.items.map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 border border-secondary/20 text-sm"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center space-y-6"
        >
          <p className="text-secondary/70 max-w-2xl mx-auto">
            {fallbackPricingData.additionalInfo}
          </p>

          <div className="flex justify-center items-center">
            <a href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 tracking-widest"
              >
                {fallbackPricingData.requestCustom}
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Geometric Elements */}
      <div className="absolute top-40 left-10 w-20 h-20 border border-secondary/10 hidden lg:block" />
      <div className="absolute bottom-40 right-10 w-16 h-16 border border-secondary/10 hidden lg:block" />
    </section>
  )
}
