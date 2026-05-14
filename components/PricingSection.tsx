'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const pricingData = {
  title: 'Investiție',
  subtitle: 'Pachete și Prețuri',
  description: 'Alege pachetul perfect pentru evenimentul tău. Toate pachetele includ editare profesională și galerie online.',
  select: 'SELECTEAZĂ',
  additionalInfo: 'Toate prețurile sunt în EUR și nu includ transport. Pentru evenimente în afara orașului, se adaugă costuri de transport și cazare după caz.',
  requestCustom: 'CERE OFERTĂ PERSONALIZATĂ',
  sedinteFoto: {
    title: 'ȘEDINȚE FOTO',
    mini: {
      name: 'MINI SESSION',
      price: '50',
      duration: '30–45 minute',
      features: ['10–15 fotografii editate', 'Livrare online', 'Portrete / cuplu / familie'],
    },
    premium: {
      name: 'PREMIUM SESSION',
      price: '100',
      duration: '1–2 ore',
      features: ['25–40 fotografii editate profesional', 'Locație la alegere', 'Livrare online + selecție extinsă'],
    },
  },
  botezuri: {
    title: 'BOTEZURI',
    basic: {
      name: 'BASIC BAPTISM',
      price: '250',
      duration: 'Ceremonie',
      features: ['Fotografiere ceremonie biserică', 'Fotografii cu familia și invitații', '100+ fotografii editate', 'Livrare online prin link privat'],
    },
    premium: {
      name: 'PREMIUM BAPTISM',
      price: '350',
      duration: 'Acoperire completă',
      features: ['Pregătiri, biserică, restaurant', '200+ fotografii editate', 'Cadre artistice & detalii', 'Preview rapid pentru social media'],
    },
  },
  nunti: {
    title: 'NUNȚI',
    basic: {
      name: 'WEDDING DAY',
      price: '500',
      duration: 'Acoperire eveniment',
      features: ['Pregătiri + ceremonie + petrecere', '300+ fotografii editate profesional', 'Livrare online HD', 'Momente spontane și cadre artistice'],
    },
    premium: {
      name: 'PREMIUM WEDDING',
      price: '700',
      duration: 'Acoperire extinsă',
      features: ['Ședință foto mire & mireasă', '500+ fotografii editate', 'Preview rapid în 24–48h', 'Galerie online premium'],
    },
  },
  evenimente: {
    title: 'EVENIMENTE PRIVATE',
    basic: {
      name: 'EVENT BASIC',
      price: '100',
      duration: '1–2 ore',
      features: ['Majorate / aniversări / petreceri private', '50+ fotografii editate'],
    },
    premium: {
      name: 'EVENT PREMIUM',
      price: '200',
      duration: 'Acoperire extinsă',
      features: ['Cadre atmosferice & invitați', '100+ fotografii editate', 'Livrare online'],
    },
  },
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

export default function PricingSection() {
  const [activeCategory, setActiveCategory] = useState<'sedinteFoto' | 'botezuri' | 'nunti' | 'evenimente'>('nunti')

  const categories = [
    { key: 'sedinteFoto' as const, label: 'ȘEDINȚE FOTO' },
    { key: 'botezuri' as const, label: 'BOTEZURI' },
    { key: 'nunti' as const, label: 'NUNȚI' },
    { key: 'evenimente' as const, label: 'EVENIMENTE' },
  ]

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
          <p className="elegant text-3xl md:text-4xl text-accent mb-4">{pricingData.title}</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">{pricingData.subtitle}</h2>
          <div className="w-24 h-px bg-secondary mx-auto mb-6" />
          <p className="text-secondary/70 max-w-2xl mx-auto">
            {pricingData.description}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-3 border transition-all duration-300 tracking-widest text-sm ${
                activeCategory === cat.key
                  ? 'bg-secondary text-primary border-secondary'
                  : 'border-secondary/30 hover:border-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Pricing Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {(() => {
              const cat = pricingData[activeCategory] as any
              const packages = [cat.mini || cat.basic, cat.premium].filter(Boolean)

              return packages.map((pkg: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 border transition-all duration-500 ${
                    index === 1
                      ? 'border-secondary bg-secondary/5 scale-105'
                      : 'border-secondary/20 hover:border-secondary/40'
                  }`}
                >
                  {/* Highlight Badge for Premium */}
                  {index === 1 && (
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

                  {/* Package Name */}
                  <h3 className="font-serif text-2xl mb-4 tracking-wider">{pkg.name}</h3>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-light">{pkg.price}</span>
                      <span className="ml-2 text-secondary/60">€</span>
                    </div>
                    <div className="text-sm text-secondary/60 mt-1">{pkg.duration}</div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature: string, idx: number) => (
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

                  {/* CTA Button */}
                  <a href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 border transition-all duration-300 tracking-widest text-sm ${
                        index === 1
                          ? 'bg-secondary text-primary border-secondary hover:bg-accent'
                          : 'border-secondary/40 hover:border-secondary hover:bg-secondary hover:text-primary'
                      }`}
                    >
                      {pricingData.select}
                    </motion.button>
                  </a>
                </motion.div>
              ))
            })()}
          </motion.div>
        </AnimatePresence>

        {/* Extra Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="font-serif text-2xl mb-8">{pricingData.extras.title}</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {pricingData.extras.items.map((item: string, index: number) => (
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
            {pricingData.additionalInfo}
          </p>

          <div className="flex justify-center items-center">
            <a href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 tracking-widest"
              >
                {pricingData.requestCustom}
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
