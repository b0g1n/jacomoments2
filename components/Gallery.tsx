'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Photo {
  id: string
  filename: string
  url: string
  category: string
  title?: string
  description?: string
  tags: { id: string; name: string }[]
}

interface Category {
  id: string
  name: string
  slug: string
}

const categoryNames: Record<string, string> = {
  'nunta': 'Nunți',
  'botez': 'Botezuri',
  'sedinta': 'Ședințe Foto',
  'eveniment': 'Evenimente',
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch('/api/photos')
        const data = await res.json()
        setPhotos(data)
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const categories: Category[] = useMemo(() => {
    const uniqueCategories = new Set(photos.map(p => p.category))
    return [
      { id: 'all', name: 'Toate', slug: 'all' },
      ...Array.from(uniqueCategories).map((slug): Category => ({
        id: slug,
        name: categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
      })),
    ]
  }, [photos])

  const currentPhotos: Photo[] = useMemo(() => {
    if (selectedCategory === 'all') {
      return photos
    }
    return photos.filter(p => p.category === selectedCategory)
  }, [selectedCategory, photos])

  if (loading) {
    return (
      <section className="relative min-h-screen py-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-secondary border-t-accent rounded-full animate-spin" />
          <p className="mt-4 text-secondary">Se încarcă galeria...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen py-32 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 geometric-dots opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] text-accent mb-4">PORTOFOLIU</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-6">
            Galerie Foto
          </h1>
          <div className="w-16 h-px bg-secondary/50 mx-auto" />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-6 py-2 transition-all duration-300 tracking-wider text-sm ${
                selectedCategory === category.slug
                  ? 'bg-secondary text-primary'
                  : 'border border-secondary/30 hover:border-secondary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {currentPhotos.length === 0 ? (
          <div className="text-center py-20 text-secondary/60">
            <p>Nu există poze în această categorie momentan.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {currentPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => setLightboxImage(photo.url)}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.title || photo.category}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="Lightbox image"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
