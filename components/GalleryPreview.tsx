'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Photo {
  id: string
  filename: string
  url: string
  category: string
}

export default function GalleryPreview() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch('/api/photos?featured=true')
        const data = await res.json()
        // If no featured photos, just get the first 6
        const photosToShow = data.length > 0 ? data.slice(0, 6) : []
        setPhotos(photosToShow)
      } catch (error) {
        console.error('Error fetching preview photos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  if (loading) {
    return (
      <section id="portofoliu" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block w-12 h-12 border-4 border-secondary border-t-accent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  // If there are no photos, render nothing.
  if (photos.length === 0) {
    return null
  }

  return (
    <section id="portofoliu" className="relative py-32 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 geometric-dots opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] text-accent mb-4">PORTOFOLIU</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Momentele Capturate
          </h2>
          <div className="w-16 h-px bg-secondary/50 mx-auto mb-6" />
          <p className="text-secondary/70 max-w-2xl mx-auto">
            Fiecare eveniment are o poveste unică. Iată câteva dintre momentele pe care le-am capturat.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden group"
            >
              <Image
                src={photo.url}
                alt={photo.category}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/portofoliu">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-secondary text-primary hover:bg-white transition-all duration-300 tracking-wider text-sm"
            >
              VEZI TOT PORTOFOLIUL
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
