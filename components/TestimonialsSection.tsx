'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import testimonialsData from '@/data/testimonials.json'

type Testimonial = {
  id: number
  name: string
  text: string
  rating: number
  date: string
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    setTestimonials(testimonialsData.testimonials)
  }, [])
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative py-32 px-4">
      {/* Geometric Background */}
      <div className="absolute inset-0 geometric-pattern opacity-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="elegant text-3xl md:text-4xl text-accent mb-4">Recenzii</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">Ce Spun Clienții</h2>
          <div className="w-24 h-px bg-secondary mx-auto" />
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative p-8 md:p-12 border border-secondary/20 bg-primary/50 backdrop-blur-sm">
                    {/* Geometric Decorations */}
                    <div className="absolute top-8 left-8 w-16 h-16 border border-secondary/20" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border border-secondary/20" />

                    {/* Rating */}
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-secondary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="font-serif text-xl md:text-2xl leading-relaxed mb-8 italic">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full border-2 border-secondary/30 flex items-center justify-center bg-secondary/10">
                        <span className="font-serif text-2xl text-secondary">
                          {testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-serif text-lg">{testimonial.name}</div>
                        <div className="text-sm text-secondary/60">
                          {testimonial.date}
                        </div>
                      </div>
                    </div>

                    {/* Quote Mark */}
                    <div className="absolute top-4 right-8 text-8xl text-secondary/10 font-serif">
                      "
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-secondary w-8' : 'bg-secondary/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 border border-secondary/30 hover:border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setActiveIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 border border-secondary/30 hover:border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center justify-center"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Simple Trust Message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center text-secondary/60 text-sm tracking-wider"
        >
          Mulțumesc pentru încredere
        </motion.p>
      </div>

      {/* Decorative Geometric Elements */}
      <div className="absolute top-20 left-20 w-12 h-12 border border-secondary/10 hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-16 h-16 border border-secondary/10 hidden lg:block" />
    </section>
  )
}
