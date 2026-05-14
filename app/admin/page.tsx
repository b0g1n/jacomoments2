'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ImageIcon,
  MessageSquare,
  Upload,
  Trash2,
  Edit,
  X,
  Check,
  LogOut,
  Plus,
  Eye,
  EyeOff,
  KeyRound,
  Package,
  Tag,
  Layers,
} from 'lucide-react'

interface Photo {
  id: string
  filename: string
  url: string
  thumbnail?: string
  title?: string
  description?: string
  category: string
  tags: { id: string; name: string }[]
  order: number
  featured: boolean
}

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  read: boolean
  createdAt: string
}

interface Package {
  id: string
  name: string
  category: string
  categoryTitle: string
  price: number
  duration: string
  features: string[]
  isPopular: boolean
  order: number
}

interface PricingContent {
  id: string
  key: string
  value: string
}

interface Category {
  id: string
  name: string
  order: number
}

const PREDEFINED_CATEGORIES = ['nunta', 'botez', 'majorat', 'sedinta', 'eveniment']

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'photos' | 'messages' | 'packages'>('photos')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [pricingContent, setPricingContent] = useState<PricingContent[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [editingContent, setEditingContent] = useState<PricingContent | null>(null)
  const [newPackage, setNewPackage] = useState<Partial<Package>>({
    name: '',
    category: 'sedinteFoto',
    categoryTitle: '',
    price: 0,
    duration: '',
    features: [],
    isPopular: false,
    order: 0,
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())

  // Upload states
  const [singleUploadFile, setSingleUploadFile] = useState<FileList | null>(null)
  const [bulkUploadFiles, setBulkUploadFiles] = useState<FileList | null>(null)
  const [uploadCategory, setUploadCategory] = useState('nunta')
  const [bulkUploadCategory, setBulkUploadCategory] = useState('nunta')
  const [useCustomCategory, setUseCustomCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [useBulkCustomCategory, setUseBulkCustomCategory] = useState(false)
  const [bulkCustomCategory, setBulkCustomCategory] = useState('')

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Fetch data
  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos')
      const data = await res.json()
      setPhotos(data)
    } catch (error) {
      console.error('Error fetching photos:', error)
    }
  }

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages')
      const data = await res.json()
      setPackages(data)
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const fetchPricingContent = async () => {
    try {
      const res = await fetch('/api/pricing-content')
      const data = await res.json()
      setPricingContent(data)
    } catch (error) {
      console.error('Error fetching pricing content:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhotos()
      fetchMessages()
      fetchPackages()
      fetchPricingContent()
      fetchCategories()
    }
  }, [isAuthenticated])

  // Show message helper
  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg)
      setTimeout(() => setErrorMessage(''), 5000)
    } else {
      setSuccessMessage(msg)
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  // Create new package
  const handleCreatePackage = async () => {
    if (!newPackage.name || !newPackage.category) {
      showMessage('Te rog completează numele pachetului și categoria!', true)
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const payload = {
        name: newPackage.name,
        category: newPackage.category,
        categoryTitle: newPackage.categoryTitle || newPackage.category,
        price: Number(newPackage.price) || 0,
        duration: newPackage.duration || '',
        features: Array.isArray(newPackage.features) ? newPackage.features : [],
        isPopular: Boolean(newPackage.isPopular),
        order: Number(newPackage.order) || 0,
      }

      console.log('Creating package with payload:', payload)

      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        await fetchPackages()
        setNewPackage({
          name: '',
          category: 'sedinteFoto',
          categoryTitle: '',
          price: 0,
          duration: '',
          features: [],
          isPopular: false,
          order: 0,
        })
        showMessage('Pachet adăugat cu succes!')
      } else {
        console.error('Error response:', data)
        showMessage(data.error || 'Eroare la adăugarea pachetului', true)
      }
    } catch (error) {
      console.error('Error creating package:', error)
      showMessage('Eroare la adăugarea pachetului', true)
    } finally {
      setLoading(false)
    }
  }

  // Update package
  const handleUpdatePackage = async (pkg: Package) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pkg.name,
          price: pkg.price,
          duration: pkg.duration,
          features: pkg.features,
          isPopular: pkg.isPopular,
        }),
      })
      if (res.ok) {
        await fetchPackages()
        setEditingPackage(null)
        showMessage('Pachet actualizat!')
      } else {
        showMessage('Eroare la actualizare', true)
      }
    } catch (error) {
      console.error('Error updating package:', error)
      showMessage('Eroare la actualizare', true)
    } finally {
      setLoading(false)
    }
  }

  // Delete package
  const handleDeletePackage = async (id: string) => {
    if (!confirm('Șterge acest pachet?')) return
    setLoading(true)
    try {
      await fetch(`/api/packages/${id}`, { method: 'DELETE' })
      await fetchPackages()
      showMessage('Pachet șters!')
    } catch (error) {
      console.error('Error deleting package:', error)
      showMessage('Eroare la ștergere', true)
    } finally {
      setLoading(false)
    }
  }

  // Update pricing content
  const handleUpdateContent = async (content: PricingContent) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pricing-content/${content.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: content.value }),
      })
      if (res.ok) {
        await fetchPricingContent()
        setEditingContent(null)
        showMessage('Conținut actualizat!')
      }
    } catch (error) {
      console.error('Error updating pricing content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password }),
      })

      const data = await res.json()

      if (data.success) {
        setIsAuthenticated(true)
        setLoginError('')
      } else {
        setLoginError('Invalid password')
      }
    } catch (error) {
      setLoginError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Photo upload handler
  const handleUpload = async (files: FileList, category: string) => {
    if (files.length === 0) {
      showMessage('Selectează cel puțin un fișier!', true)
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        return await res.json()
      })

      const uploads = await Promise.all(uploadPromises)

      // Create photo entries in database
      let successCount = 0
      for (const upload of uploads) {
        if (upload.success) {
          await fetch('/api/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: upload.filename,
              url: upload.url,
              category: upload.category,
              tags: [],
            }),
          })
          successCount++
        }
      }

      await fetchPhotos()
      setSingleUploadFile(null)
      setBulkUploadFiles(null)

      if (successCount === uploads.length) {
        showMessage(`${successCount} poze încărcate cu succes!`)
      } else {
        showMessage(`${successCount}/${uploads.length} poze încărcate`, true)
      }
    } catch (error) {
      console.error('Error uploading photos:', error)
      showMessage('Eroare la încărcare', true)
    } finally {
      setLoading(false)
    }
  }

  // Update photo
  const handleUpdatePhoto = async (photo: Photo) => {
    setLoading(true)

    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: photo.title,
          description: photo.description,
          category: photo.category,
          tags: photo.tags.map((t) => t.name),
          featured: photo.featured,
          order: photo.order,
        }),
      })

      if (res.ok) {
        await fetchPhotos()
        setEditingPhoto(null)
        showMessage('Foto actualizată!')
      }
    } catch (error) {
      console.error('Error updating photo:', error)
    } finally {
      setLoading(false)
    }
  }

  // Delete photo
  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    setLoading(true)

    try {
      await fetch(`/api/photos/${id}`, { method: 'DELETE' })
      await fetchPhotos()
      showMessage('Foto ștearsă!')
    } catch (error) {
      console.error('Error deleting photo:', error)
    } finally {
      setLoading(false)
    }
  }

  // Bulk delete photos
  const handleBulkDelete = async () => {
    if (selectedPhotos.size === 0) return
    if (!confirm(`Delete ${selectedPhotos.size} photos?`)) return

    setLoading(true)

    try {
      await Promise.all(
        Array.from(selectedPhotos).map((id) =>
          fetch(`/api/photos/${id}`, { method: 'DELETE' })
        )
      )
      setSelectedPhotos(new Set())
      await fetchPhotos()
      showMessage('Poze șterse!')
    } catch (error) {
      console.error('Error bulk deleting photos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark message as read/unread
  const handleToggleMessageRead = async (id: string, read: boolean) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !read }),
      })
      await fetchMessages()
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return

    setLoading(true)

    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      await fetchMessages()
      showMessage('Mesaj șters!')
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setLoading(false)
    }
  }

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setPasswordSuccess('Password changed successfully!')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => {
          setShowPasswordModal(false)
          setPasswordSuccess('')
        }, 2000)
      } else {
        setPasswordError(data.error || 'Failed to change password')
      }
    } catch (error) {
      setPasswordError('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  // Get display name for content key
  const getContentLabel = (key: string) => {
    const labels: Record<string, string> = {
      title: 'Titlu',
      subtitle: 'Subtitlu',
      description: 'Descriere',
      select: 'Buton Select',
      additionalInfo: 'Informații Adiționale',
      requestCustom: 'Buton Ofertă Personalizată',
      extrasTitle: 'Titlu Extra Opționale',
      extrasItems: 'Lista Extra Opționale (separate prin virgulă)',
    }
    return labels[key] || key
  }

  // Get actual category to use for upload
  const getUploadCategory = () => {
    return useCustomCategory && customCategory ? customCategory : uploadCategory
  }

  const getBulkUploadCategory = () => {
    return useBulkCustomCategory && bulkCustomCategory ? bulkCustomCategory : bulkUploadCategory
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-100 rounded-lg p-8 max-w-md w-full shadow-xl"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-neutral-300 rounded focus:outline-none focus:border-neutral-400 bg-white text-black"
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-sm mb-4">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-800 text-white py-3 rounded font-bold hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-neutral-100 text-black py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jaco Moments Admin</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-400 text-black rounded hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <KeyRound size={18} />
              Schimbă Parola
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-neutral-100 border-b border-neutral-300">
        <div className="max-w-7xl mx-auto flex">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-4 font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'photos'
                ? 'text-black border-b-2 border-neutral-400'
                : 'text-black hover:text-black'
            }`}
          >
            <ImageIcon size={18} />
            Poze
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-4 font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'messages'
                ? 'text-black border-b-2 border-neutral-400'
                : 'text-black hover:text-black'
            }`}
          >
            <MessageSquare size={18} />
            Mesaje
            {messages.filter((m) => !m.read).length > 0 && (
              <span className="bg-neutral-800 text-white text-xs px-2 py-0.5 rounded-full">
                {messages.filter((m) => !m.read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-4 font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'packages'
                ? 'text-black border-b-2 border-neutral-400'
                : 'text-black hover:text-black'
            }`}
          >
            <Package size={18} />
            Pachete și Prețuri
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {errorMessage && (
        <div className="bg-red-600 text-white px-6 py-3 text-center font-bold">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-600 text-white px-6 py-3 text-center font-bold">
          {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div>
            {/* Upload Section */}
            <div className="bg-neutral-100 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-black mb-4">Încarcă Poze</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Single Upload */}
                <div className="bg-white rounded-lg p-4 border border-neutral-300">
                  <h3 className="font-bold text-black mb-3">Încărcare Single</h3>

                  <div className="mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSingleUploadFile(e.target.files)}
                      className="w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-200 file:text-black hover:file:bg-neutral-300"
                    />
                  </div>

                  <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="singleCustom"
                        checked={useCustomCategory}
                        onChange={(e) => setUseCustomCategory(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="singleCustom" className="text-sm font-bold text-black">
                        Categorie custom
                      </label>
                    </div>

                    {!useCustomCategory ? (
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded bg-white text-black"
                      >
                        {PREDEFINED_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Introdu categoria custom..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded bg-white text-black"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => singleUploadFile && handleUpload(singleUploadFile, getUploadCategory())}
                    disabled={loading || !singleUploadFile}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded font-bold hover:bg-neutral-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    {loading ? 'Se încarcă...' : 'Încarcă Poza'}
                  </button>
                </div>

                {/* Bulk Upload */}
                <div className="bg-white rounded-lg p-4 border border-neutral-300">
                  <h3 className="font-bold text-black mb-3">Încărcare Multiplă</h3>

                  <div className="mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setBulkUploadFiles(e.target.files)}
                      className="w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-200 file:text-black hover:file:bg-neutral-300"
                    />
                    {bulkUploadFiles && bulkUploadFiles.length > 0 && (
                      <p className="text-sm text-black mt-1">{bulkUploadFiles.length} fișiere selectate</p>
                    )}
                  </div>

                  <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="bulkCustom"
                        checked={useBulkCustomCategory}
                        onChange={(e) => setUseBulkCustomCategory(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="bulkCustom" className="text-sm font-bold text-black">
                        Categorie custom
                      </label>
                    </div>

                    {!useBulkCustomCategory ? (
                      <select
                        value={bulkUploadCategory}
                        onChange={(e) => setBulkUploadCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded bg-white text-black"
                      >
                        {PREDEFINED_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Introdu categoria custom..."
                        value={bulkCustomCategory}
                        onChange={(e) => setBulkCustomCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded bg-white text-black"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => bulkUploadFiles && handleUpload(bulkUploadFiles, getBulkUploadCategory())}
                    disabled={loading || !bulkUploadFiles || bulkUploadFiles.length === 0}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded font-bold hover:bg-neutral-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    {loading ? 'Se încarcă...' : `Încarcă ${bulkUploadFiles?.length || 0} Poze`}
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedPhotos.size > 0 && (
              <div className="bg-red-600 text-white rounded-lg p-4 mb-6 flex justify-between items-center">
                <span>{selectedPhotos.size} poze selectate</span>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100"
                >
                  <Trash2 size={18} />
                  Șterge Selectate
                </button>
              </div>
            )}

            {/* Photos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative group bg-neutral-100 rounded-lg overflow-hidden ${
                    selectedPhotos.has(photo.id) ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title || photo.filename}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                    <button
                      onClick={() => setEditingPhoto(photo)}
                      className="bg-white text-black px-3 py-1 rounded text-sm font-bold hover:bg-neutral-300"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedPhotos((prev) => {
                          const next = new Set(prev)
                          if (next.has(photo.id)) next.delete(photo.id)
                          else next.add(photo.id)
                          return next
                        })
                      }
                      className={`px-3 py-1 rounded text-sm font-bold ${
                        selectedPhotos.has(photo.id)
                          ? 'bg-neutral-800 text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      {selectedPhotos.has(photo.id) ? <Check size={16} /> : <Plus size={16} />}
                    </button>
                  </div>
                  {photo.featured && (
                    <div className="absolute top-2 right-2 bg-neutral-800 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1 truncate">
                    {photo.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-neutral-100 rounded-lg">
            {messages.length === 0 ? (
              <p className="text-center py-12 text-black">Nu există mesaje</p>
            ) : (
              <div className="divide-y divide-neutral-300">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 ${!msg.read ? 'bg-neutral-200' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-black">{msg.name}</h3>
                        <p className="text-sm text-black">{msg.email}</p>
                        {msg.phone && (
                          <p className="text-sm text-black">{msg.phone}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                          className="p-2 hover:bg-neutral-300 rounded text-black"
                          title={msg.read ? 'Marchează ca necitit' : 'Marchează ca citit'}
                        >
                          {msg.read ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {msg.subject && (
                      <p className="font-bold text-black mb-2">{msg.subject}</p>
                    )}
                    <p className="text-black">{msg.message}</p>
                    <p className="text-sm text-black mt-2">
                      {new Date(msg.createdAt).toLocaleString('ro-RO')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Packages & Pricing Tab */}
        {activeTab === 'packages' && (
          <div className="space-y-8">
            {/* Pricing Content Section */}
            <div className="bg-neutral-100 rounded-lg p-6">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Tag size={20} />
                Conținut Pagină Pachete
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pricingContent.map((content) => (
                  <div key={content.id} className="bg-white rounded-lg p-4 border border-neutral-300">
                    <label className="block text-sm font-bold mb-2 text-black">
                      {getContentLabel(content.key)}
                    </label>
                    {content.key === 'extrasItems' ? (
                      <textarea
                        value={content.value}
                        onChange={(e) => {
                          const updated = pricingContent.map(c =>
                            c.id === content.id ? { ...c, value: e.target.value } : c
                          )
                          setPricingContent(updated)
                        }}
                        onBlur={() => handleUpdateContent(content)}
                        className="w-full px-3 py-2 border rounded text-black"
                        rows={3}
                        placeholder="Separate items with commas"
                      />
                    ) : (
                      <input
                        type="text"
                        value={content.value}
                        onChange={(e) => {
                          const updated = pricingContent.map(c =>
                            c.id === content.id ? { ...c, value: e.target.value } : c
                          )
                          setPricingContent(updated)
                        }}
                        onBlur={() => handleUpdateContent(content)}
                        className="w-full px-3 py-2 border rounded text-black"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Packages Management */}
            <div className="bg-neutral-100 rounded-lg p-6">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Layers size={20} />
                Pachete
              </h2>

              {/* Add New Package Form */}
              <div className="bg-white rounded-lg p-4 mb-6 border border-neutral-300">
                <h3 className="font-bold text-black mb-3">Adaugă Pachet Nou</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">Nume pachet *</label>
                    <input
                      type="text"
                      value={newPackage.name || ''}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded bg-white text-black"
                      placeholder="ex: MINI SESSION"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">Categorie *</label>
                    <select
                      value={newPackage.category || ''}
                      onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded bg-white text-black"
                    >
                      <option value="sedinteFoto">Ședințe Foto</option>
                      <option value="botezuri">Botezuri</option>
                      <option value="nunti">Nunți</option>
                      <option value="evenimente">Evenimente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">Titlu Categorie</label>
                    <input
                      type="text"
                      value={newPackage.categoryTitle || ''}
                      onChange={(e) => setNewPackage({ ...newPackage, categoryTitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded bg-white text-black"
                      placeholder="ex: ȘEDINȚE FOTO"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">Preț (€) *</label>
                    <input
                      type="number"
                      value={newPackage.price || 0}
                      onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded bg-white text-black"
                      min={0}
                      placeholder="ex: 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">Durată</label>
                    <input
                      type="text"
                      value={newPackage.duration || ''}
                      onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded bg-white text-black"
                      placeholder="ex: 1-2 ore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-black">Caracteristici (separate prin virgulă)</label>
                    <input
                      type="text"
                      value={Array.isArray(newPackage.features) ? newPackage.features.join(', ') : ''}
                      onChange={(e) => setNewPackage({ ...newPackage, features: e.target.value.split(',').filter(f => f.trim()) })}
                      className="w-full px-3 py-2 border rounded bg-white text-black"
                      placeholder="ex: 10-15 fotografii, Livrare online"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="newPopular"
                      checked={newPackage.isPopular || false}
                      onChange={(e) => setNewPackage({ ...newPackage, isPopular: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="newPopular" className="text-sm font-bold text-black">
                      Marchează ca Popular
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleCreatePackage}
                  disabled={loading || !newPackage.name || !newPackage.category}
                  className="mt-4 bg-neutral-800 text-white px-6 py-2 rounded font-bold hover:bg-neutral-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus size={18} />
                  {loading ? 'Se adaugă...' : 'Adaugă Pachet'}
                </button>
              </div>

              {/* Existing Packages */}
              <div className="space-y-6">
                {(['sedinteFoto', 'botezuri', 'nunti', 'evenimente'] as const).map((cat) => {
                  const catPackages = packages.filter((p) => p.category === cat)
                  if (catPackages.length === 0) return null
                  return (
                    <div key={cat}>
                      <h3 className="text-lg font-bold text-black mb-3">
                        {catPackages[0].categoryTitle || cat}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {catPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="bg-white rounded-lg p-4 border border-neutral-300 relative"
                          >
                            {pkg.isPopular && (
                              <span className="absolute top-4 right-4 bg-neutral-800 text-white text-xs px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                            <h4 className="font-bold text-black">{pkg.name}</h4>
                            <p className="text-black font-bold text-xl">{pkg.price} €</p>
                            <p className="text-black/60 text-sm mb-2">{pkg.duration}</p>
                            <ul className="text-sm text-black mb-3">
                              {pkg.features.map((f, i) => (
                                <li key={i}>• {f}</li>
                              ))}
                            </ul>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingPackage({ ...pkg })}
                                className="flex items-center gap-1 px-3 py-1 border border-neutral-400 text-black rounded hover:bg-neutral-200 text-sm"
                              >
                                <Edit size={14} />
                                Editează
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="flex items-center gap-1 px-3 py-1 border border-red-400 text-red-600 rounded hover:bg-red-50 text-sm"
                              >
                                <Trash2 size={14} />
                                Șterge
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {packages.length === 0 && (
                  <p className="text-center py-8 text-black">Nu există pachete. Adaugă primul pachet mai sus!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Photo Modal */}
      <AnimatePresence>
        {editingPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setEditingPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-100 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Editează Poza</h2>
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="p-2 hover:bg-neutral-300 rounded text-black"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <img
                  src={editingPhoto.url}
                  alt={editingPhoto.title || editingPhoto.filename}
                  className="w-full max-h-64 object-contain bg-black rounded"
                />

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Titlu</label>
                  <input
                    type="text"
                    value={editingPhoto.title || ''}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Descriere</label>
                  <textarea
                    value={editingPhoto.description || ''}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white text-black"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Categorie</label>
                  <select
                    value={editingPhoto.category}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white text-black"
                  >
                    {PREDEFINED_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Sau scrie categoria custom..."
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white text-black mt-2"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingPhoto.featured}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, featured: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="font-bold text-black">
                    Featured photo
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditingPhoto(null)}
                    className="px-4 py-2 border rounded hover:bg-neutral-300 text-black"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={() => handleUpdatePhoto(editingPhoto)}
                    disabled={loading}
                    className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 disabled:opacity-50"
                  >
                    Salvează
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Package Modal */}
      <AnimatePresence>
        {editingPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setEditingPackage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-100 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">
                  Editează Pachet — {editingPackage.categoryTitle}
                </h2>
                <button
                  onClick={() => setEditingPackage(null)}
                  className="p-2 hover:bg-neutral-300 rounded text-black"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Nume pachet</label>
                  <input
                    type="text"
                    value={editingPackage.name}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Preț (€)</label>
                  <input
                    type="number"
                    value={editingPackage.price}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded bg-white text-black"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Durată</label>
                  <input
                    type="text"
                    value={editingPackage.duration}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-black">Ce include</label>
                  <div className="space-y-2">
                    {editingPackage.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const newFeatures = [...editingPackage.features]
                            newFeatures[idx] = e.target.value
                            setEditingPackage({ ...editingPackage, features: newFeatures })
                          }}
                          className="flex-1 px-3 py-2 border rounded bg-white text-black text-sm"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = editingPackage.features.filter((_, i) => i !== idx)
                            setEditingPackage({ ...editingPackage, features: newFeatures })
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditingPackage({
                          ...editingPackage,
                          features: [...editingPackage.features, ''],
                        })
                      }
                      className="flex items-center gap-2 text-sm text-black hover:underline"
                    >
                      <Plus size={14} />
                      Adaugă linie
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pkgPopular"
                    checked={editingPackage.isPopular}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, isPopular: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="pkgPopular" className="font-bold text-sm text-black">
                    Marchează ca Popular
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditingPackage(null)}
                    className="px-4 py-2 border rounded hover:bg-neutral-300 text-black"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={() => handleUpdatePackage(editingPackage)}
                    disabled={loading}
                    className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 disabled:opacity-50"
                  >
                    {loading ? 'Se salvează...' : 'Salvează'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-100 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Schimbă Parola</h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordError('')
                    setPasswordSuccess('')
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  }}
                  className="p-2 hover:bg-neutral-300 rounded text-black"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Parola Curentă</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded bg-white text-black focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Parola Nouă</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border rounded bg-white text-black focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Confirmă Parola Nouă</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border rounded bg-white text-black focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPasswordError('')
                      setPasswordSuccess('')
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    }}
                    className="px-4 py-2 border rounded hover:bg-neutral-300 text-black"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 disabled:opacity-50"
                  >
                    {loading ? 'Se schimbă...' : 'Schimbă Parola'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
