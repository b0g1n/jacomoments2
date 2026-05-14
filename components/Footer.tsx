'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const footerLinks = {
    navigare: [
      { name: 'Acasă', href: '/' },
      { name: 'Portofoliu', href: '/portofoliu' },
      { name: 'Despre', href: '/despre' },
      { name: 'Pachete', href: '/pachete' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Termeni și Condiții', href: '/termeni' },
      { name: 'Politica de Confidențialitate', href: '/privacitate' },
      { name: 'Politica Cookies', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
    contact: [
      { name: '+40 730 876 987', href: 'tel:+40730876987' },
      { name: 'jacomoments@gmail.com', href: 'mailto:jacomoments@gmail.com' },
      { name: 'Timișoara, Romania', href: '#' },
    ],
  }

  return (
    <footer className="relative pt-20 pb-8 px-4 border-t border-secondary/20">
      {/* Geometric Background */}
      <div className="absolute inset-0 geometric-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 border-2 border-secondary flex items-center justify-center">
                <div className="w-4 h-4 bg-secondary" />
              </div>
              <span className="font-serif text-2xl font-light tracking-wider">
                Jaco Moments
              </span>
            </div>
            <p className="text-secondary/70 text-sm leading-relaxed">
              Fotograf de evenimente în Timișoara. Captur momentele autentice ale nunții tale cu un stil documentar și o abordare calmă.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3 pt-4">
              <motion.a
                href="https://www.instagram.com/jacomoments"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-secondary/30 flex items-center justify-center hover:border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 text-xs"
                aria-label="Instagram"
              >
                IG
              </motion.a>
              <motion.a
                href="https://www.facebook.com/people/JacoMoments/61584043523601/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-secondary/30 flex items-center justify-center hover:border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 text-xs"
                aria-label="Facebook"
              >
                FB
              </motion.a>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-serif text-lg mb-6">Navigare</h4>
            <ul className="space-y-3">
              {footerLinks.navigare.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary/70 hover:text-secondary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-serif text-lg mb-6">Contact</h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary/70 hover:text-secondary transition-colors duration-300 text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-secondary/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-secondary/60 text-sm">
              © {new Date().getFullYear()} Jaco Moments. Toate drepturile rezervate.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-secondary/60 hover:text-secondary transition-colors duration-300 text-xs tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Felistar Branding */}
            <div className="text-secondary/40 text-xs">
              Creat de <span className="text-accent font-semibold">Felistar</span> ©
            </div>
          </div>
        </motion.div>

        {/* Decorative Geometric Elements */}
        <div className="absolute top-20 left-10 w-8 h-8 border border-secondary/10 hidden lg:block" />
        <div className="absolute bottom-20 right-10 w-12 h-12 border border-secondary/10 hidden lg:block" />
      </div>
    </footer>
  )
}
