'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Loader2, Sparkles, Heart, Camera, Crown } from 'lucide-react'

// Wedding-themed premium loader
export function WeddingLoader({ message = 'Se încarcă momentele unice...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="text-center space-y-8">
        {/* Animated heart camera */}
        <div className="relative">
          <motion.div
            className="w-24 h-24 mx-auto"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="relative w-full h-full">
              {/* Outer ring */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
              {/* Camera icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Camera className="w-12 h-12 text-white/80" />
              </motion.div>
              {/* Floating hearts */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3 h-3"
                  animate={{
                    rotate: [0, 360],
                    x: [0, Math.cos((i * 120) * Math.PI / 180) * 48],
                    y: [0, Math.sin((i * 120) * Math.PI / 180) * 48],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                >
                  <Heart className="w-full h-full text-pink-400/60 fill-pink-400/60" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Elegant loading message */}
        <motion.div
          className="space-y-3"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-lg text-white/80 uppercase tracking-[0.3em] font-light">
            {message}
          </p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-white/60 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Premium gallery loading skeleton
export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="aspect-square bg-white/5 rounded-lg overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Elegant magnetic button for wedding theme
export function MagneticWeddingButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) * 0.3
    const y = (e.clientY - centerY) * 0.3
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const variants = {
    primary: 'bg-white text-black hover:bg-white/90',
    secondary: 'bg-transparent text-white border-2 border-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/5',
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={onClick}
        className={`px-8 py-4 rounded-full font-semibold uppercase tracking-[0.2em] text-sm transition-all ${variants[variant]}`}
      >
        <span className="flex items-center gap-3">
          {isHovered && <Sparkles className="w-4 h-4" />}
          {children}
          {isHovered && <Sparkles className="w-4 h-4" />}
        </span>
      </motion.button>
    </motion.div>
  )
}

// Premium text reveal for romantic messages
export function RomanticTextReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(' ')

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay }}
    >
      {words.map((word, index) => (
        <motion.span
          key={word + index}
          className="inline-block mr-3 last:mr-0"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: delay + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Elegant floating elements
export function FloatingElements({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {/* Decorative floating elements */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() * 360, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          <div className="w-2 h-2 bg-white/20 rounded-full" />
        </motion.div>
      ))}
    </div>
  )
}

// Premium crown badge for luxury feel
export function CrownBadge({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  return (
    <motion.div
      className={`inline-flex items-center space-x-3 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/20 rounded-full ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Crown className="w-5 h-5 text-yellow-400/80" />
      </motion.div>
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/90">
        {text}
      </span>
      <motion.div
        animate={{ rotate: [0, -15, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Crown className="w-5 h-5 text-yellow-400/80" />
      </motion.div>
    </motion.div>
  )
}
