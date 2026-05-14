'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Camera, Mail, Phone } from 'lucide-react'

export default function AboutSection() {
  return (
    <section id="despre" className="relative py-32 px-4">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 geometric-dots opacity-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] text-accent mb-4">DESPRE MINE</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Salut, sunt Bogdan
          </h2>
          <div className="w-16 h-px bg-secondary/50 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Photo + Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Photographer Photo */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/images/photographer.jpg"
                alt="Bogdan Jacotei - Fotograf de evenimente"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              <a href="tel:+40730876987" className="flex items-center gap-4 p-4 border border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-secondary/60">Telefon</div>
                  <div className="font-medium">+40 730 876 987</div>
                </div>
              </a>

              <a href="mailto:jacomoments@gmail.com" className="flex items-center gap-4 p-4 border border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-secondary/60">Email</div>
                  <div className="font-medium">jacomoments@gmail.com</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 border border-secondary/20">
                <div className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-secondary/60">Bazat în</div>
                  <div className="font-medium">Timișoara, România</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-6 text-secondary/80 leading-relaxed">
              <p className="text-lg text-secondary font-light">
                Povestea mea în fotografie începe din pasiunea pentru oameni, emoții și momente reale. Pentru mine, fotografia nu înseamnă doar imagini frumoase, ci amintiri care transmit atmosferă, energie și autenticitate.
              </p>

              <p>
                Sunt o persoană atentă la detalii, creativă și perfecționistă, iar aceste lucruri se reflectă în fiecare cadru pe care îl realizez. Îmi place să surprind emoțiile naturale, conexiunile dintre oameni și acele momente spontane care fac diferența într-o poveste.
              </p>

              <p>
                Prin JacoMoments, îmi doresc să ofer mai mult decât simple fotografii — experiențe și amintiri care rămân vii peste ani. Fie că este vorba despre un botez, o aniversare, o ședință foto sau un eveniment special, abordarea mea este mereu una relaxată, profesională și orientată către oameni.
              </p>

              <p className="text-secondary/60 italic">
                Cred că cele mai frumoase fotografii sunt cele sincere. De aceea, încerc mereu să creez un mediu în care oamenii să se simtă confortabil și să fie exact așa cum sunt.
              </p>
            </div>

            {/* Simple Stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-8 border-t border-secondary/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-serif">12+</div>
                  <div className="text-sm text-secondary/60">evenimente memorabile</div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <a href="#contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-secondary text-primary hover:bg-white transition-all duration-300 tracking-wider text-sm"
                >
                  HAI SĂ DISCUTĂM
                </motion.button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Simple Decorative Elements */}
      <div className="absolute top-20 left-10 w-8 h-8 border border-secondary/10 hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-12 h-12 border border-secondary/10 hidden lg:block" />
    </section>
  )
}
