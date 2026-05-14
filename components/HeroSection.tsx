'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Camera } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Simple Background */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <Image
          src="/hero.jpg"
          alt="Jaco Moments Wedding Photography"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Warmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-amber-950/70" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Camera Icon - Simple Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 rounded-full border-2 border-secondary/40 flex items-center justify-center">
            <Camera className="w-6 h-6 text-secondary" />
          </div>
        </motion.div>

        {/* Location Badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm tracking-[0.2em] text-secondary/60 mb-6"
        >
          FOTOGRAF DE NUNTĂ • TIMIȘOARA
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight"
        >
          <span className="block text-gradient bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            Jaco Moments
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-xl text-secondary/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Fotografierea evenimentului tău cu atenție la detalii, momente autentice și un stil care spune o poveste.
        </motion.p>

        {/* Single Stat - Focus on Events, Not Experience */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-secondary/20 rounded-full">
            <span className="font-serif text-2xl">12+</span>
            <span className="text-sm text-secondary/60">evenimente capturate</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="/portofoliu">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-secondary text-primary font-medium tracking-wider transition-all duration-300 hover:bg-white"
            >
              VEZI PORTOFOLIU
            </motion.button>
          </a>

          <a href="/contact">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 border border-secondary/50 hover:border-white transition-all duration-300 tracking-wider"
            >
              CONTACTEAZĂ-MĂ
            </motion.button>
          </a>
        </motion.div>
      </motion.div>

      {/* Simple Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-secondary/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-secondary/60 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Simple Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-secondary/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-secondary/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-secondary/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-secondary/20" />
    </section>
  )
}
