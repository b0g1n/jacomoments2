'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhoneIcon, EmailIcon, ClockIcon } from './Icons'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    location: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Nunta: ${formData.weddingDate} - ${formData.location}`,
          message: formData.message,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          weddingDate: '',
          location: '',
          message: '',
        })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 5000)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }

    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      title: 'Telefon',
      value: '+40 730 876 987',
      icon: PhoneIcon,
      link: 'tel:+40730876987',
    },
    {
      title: 'Email',
      value: 'jacomoments@gmail.com',
      icon: EmailIcon,
      link: 'mailto:jacomoments@gmail.com',
    },
    {
      title: 'Program',
      value: 'Luni - Sâmbătă: 9:00 - 18:00',
      icon: ClockIcon,
      link: null,
    },
  ]

  return (
    <section id="contact" className="relative py-32 px-4">
      {/* Geometric Background */}
      <div className="absolute inset-0 geometric-lines opacity-20" />
      <div className="absolute inset-0 geometric-dots opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="elegant text-3xl md:text-4xl text-accent mb-4">Contact</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">Hai să Vorbim</h2>
          <div className="w-24 h-px bg-secondary mx-auto mb-6" />
          <p className="text-secondary/70 max-w-2xl mx-auto">
            Suntem aici să răspundem la orice întrebare și să te ajutăm să planificăm nunta perfectă.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="p-8 border border-secondary/20 bg-primary/50 backdrop-blur-sm">
              {/* Geometric Decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/30" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/30" />

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-900/30 border border-green-700/50 text-green-300 text-sm"
                  >
                    Mulțumim pentru mesaj! Vă vom contacta în curând.
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-900/30 border border-red-700/50 text-red-300 text-sm"
                  >
                    Eroare la trimiterea mesajului. Vă rugăm să încercați din nou.
                  </motion.div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm tracking-wider mb-2">
                    Nume Complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-secondary/30 focus:border-secondary transition-colors duration-300 outline-none"
                    placeholder="Numele tău și partenerului"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm tracking-wider mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-secondary/30 focus:border-secondary transition-colors duration-300 outline-none"
                    placeholder="email@exemplu.ro"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm tracking-wider mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-secondary/30 focus:border-secondary transition-colors duration-300 outline-none"
                    placeholder="+40 7XX XXX XXX"
                  />
                </div>

                <div>
                  <label htmlFor="weddingDate" className="block text-sm tracking-wider mb-2">
                    Data Nunții
                  </label>
                  <input
                    type="date"
                    id="weddingDate"
                    name="weddingDate"
                    value={formData.weddingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent border border-secondary/30 focus:border-secondary transition-colors duration-300 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm tracking-wider mb-2">
                    Locație Nunți
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent border border-secondary/30 focus:border-secondary transition-colors duration-300 outline-none"
                    placeholder="Oraș / Locație"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm tracking-wider mb-2">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-transparent border border-secondary/30 focus:border-secondary transition-colors duration-300 outline-none resize-none"
                    placeholder="Spune-ne mai multe despre nunta ta..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-secondary text-primary hover:bg-accent transition-all duration-300 tracking-widest disabled:opacity-50"
                >
                  {isSubmitting ? 'SE TRIMITE...' : 'TRIMITE MESAJUL'}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-serif text-2xl mb-6">Informații Contact</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 border border-secondary/20 hover:border-secondary/40 transition-colors duration-300"
                    {...(info.link && { as: 'a', href: info.link })}
                  >
                    <div className="text-secondary">
                      <info.icon />
                    </div>
                    <div>
                      <div className="text-sm text-secondary/60 tracking-wider mb-1">
                        {info.title}
                      </div>
                      <div className="font-medium">{info.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-8 border-t border-secondary/20">
              <h4 className="font-serif text-xl mb-4">Urmărește-ne</h4>
              <div className="flex space-x-4">
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/jacomoments' },
                  { name: 'Facebook', url: 'https://www.facebook.com/people/Jaco Moments/61584043523601/' },
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 border border-secondary/30 flex items-center justify-center hover:border-secondary hover:bg-secondary hover:text-primary transition-all duration-300"
                  >
                    <span className="text-xs tracking-wider">{social.name.slice(0, 2).toUpperCase()}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 border border-secondary/20 bg-secondary/5"
            >
              <p className="text-secondary/80 mb-4">
                Preferi să ne vorbești direct? Sună-ne sau trimite un WhatsApp pentru un răspuns rapid.
              </p>
              <a href="https://wa.me/40722123456" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border border-secondary hover:bg-secondary hover:text-primary transition-all duration-300 tracking-widest text-sm"
                >
                  WHATSAPP
                </motion.button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Geometric Elements */}
      <div className="absolute top-40 left-20 w-16 h-16 border border-secondary/10 hidden lg:block" />
      <div className="absolute bottom-40 right-20 w-20 h-20 border border-secondary/10 hidden lg:block" />
    </section>
  )
}
