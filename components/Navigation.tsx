'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Acasă', href: '/' },
    { name: 'Portofoliu', href: '/portofoliu' },
    { name: 'Despre', href: '/despre' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-primary/95 backdrop-blur-xl border-b border-secondary/20 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
          animate={{
            scaleX: isScrolled ? 1 : 0.8,
            opacity: isScrolled ? 1 : 0.5
          }}
          transition={{ duration: 0.5 }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-12 h-12 border-2 border-secondary flex items-center justify-center relative overflow-hidden group">
                  <motion.div
                    className="absolute inset-0 bg-secondary/10"
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className="w-5 h-5 bg-secondary relative z-10"
                    whileHover={{
                      scale: 1.1
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 border-2 border-secondary/30 transform rotate-45" />
                  <div className="absolute inset-2 border border-secondary/20 transform -rotate-12" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  className="font-serif text-xl font-light tracking-wider group-hover:text-accent transition-colors duration-500"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  Jaco Moments
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] tracking-[0.3em] text-secondary/60"
                >
                  FOTOGRAF DE NUNTĂ
                </motion.span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-10">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className="relative group text-sm tracking-widest py-2"
                  >
                    <span className="relative z-10 group-hover:text-accent transition-colors duration-300">
                      {item.name}
                    </span>
                    {/* Enhanced underline effect */}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary group-hover:w-full transition-all duration-500" />
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-px bg-secondary/30"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-secondary/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div className="w-px h-8 bg-secondary/20" />

              {/* Enhanced CTA Button */}
              <a href="#contact">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(255,255,255,0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-6 py-2.5 border border-secondary overflow-hidden"
                >
                  <span className="relative z-10 text-sm tracking-widest group-hover:text-primary transition-colors duration-300">CERE OFERTĂ</span>
                  <motion.div
                    className="absolute inset-0 bg-secondary"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-secondary/50" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-secondary/50" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-secondary/50" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-secondary/50" />
                </motion.button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1.5"
            >
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-secondary block transition-all"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-px bg-secondary block transition-all"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-secondary block transition-all"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-primary lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <a href="#contact">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 text-lg tracking-widest mt-8"
                >
                  REZERVĂ
                </motion.button>
              </a>
            </div>

            {/* Geometric Decorations */}
            <div className="absolute top-20 left-8 w-20 h-20 border border-secondary/20" />
            <div className="absolute bottom-20 right-8 w-20 h-20 border border-secondary/20" />
            <div className="absolute top-1/2 left-1/4 w-10 h-10 border border-secondary/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
