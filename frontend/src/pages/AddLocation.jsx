import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Map } from 'lucide-react'
import StarRating from '../components/StarRating'
import { getCurrentLocation, openInGoogleMaps } from '../utils/maps'
import axios from 'axios'

const AddLocation = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  
  const [formData, setFormData] = useState({
    location: '',
    type: '',
    dangerRating: 0,
    image: null,
    description: '',
    locationRating: 0,
    latitude: '',
    longitude: ''
  })
  const [gettingLocation, setGettingLocation] = useState(false)

  const toiletTypes = [
    'WC Publique',
    'Dans la nature', 
    'Chez quelqu\'un',
    'Poteau',
    'Canal',
    'Autre'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDangerRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      dangerRating: rating
    }))
  }

  const handleLocationRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      locationRating: rating
    }))
  }

  const handleGetCurrentLocation = async () => {
    setGettingLocation(true)
    setError('')

    try {
      const coords = await getCurrentLocation()
      setFormData(prev => ({
        ...prev,
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString()
      }))
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération de votre position'
      if (error.message.includes('denied')) {
        errorMessage = 'Accès à la géolocalisation refusé'
      } else if (error.message.includes('unavailable')) {
        errorMessage = 'Position non disponible'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout lors de la récupération de la position'
      }
      setError(errorMessage)
    } finally {
      setGettingLocation(false)
    }
  }

  const handleOpenInGoogleMaps = () => {
    if (formData.latitude && formData.longitude) {
      openInGoogleMaps(
        parseFloat(formData.latitude),
        parseFloat(formData.longitude),
        formData.location
      )
    }
  }

  const validateForm = () => {
    if (!formData.location.trim()) {
      setError('L\'endroit est requis')
      return false
    }
    if (!formData.type) {
      setError('Le type est requis')
      return false
    }
    if (formData.dangerRating === 0) {
      setError('La note de dangerosité est requise')
      return false
    }
    if (!formData.description.trim()) {
      setError('La description est requise')
      return false
    }
    if (formData.locationRating === 0) {
      setError('La note de l\'endroit est requise')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      const submitData = new FormData()
      submitData.append('location', formData.location)
      submitData.append('type', formData.type)
      submitData.append('dangerRating', formData.dangerRating)
      submitData.append('description', formData.description)
      submitData.append('locationRating', formData.locationRating)
      
      if (formData.latitude) {
        submitData.append('latitude', formData.latitude)
      }
      if (formData.longitude) {
        submitData.append('longitude', formData.longitude)
      }
      
      if (formData.image) {
        submitData.append('image', formData.image)
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      await axios.post(`${apiUrl}/locations`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Redirect to history page on success
      navigate('/history')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(
        err.response?.data?.message || 
        'Erreur lors de l\'ajout de l\'endroit. Veuillez réessayer.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          Ajouter un nouvel endroit
        </h1>
        <p className="text-gray-600">
          Partagez votre expérience et aidez la communauté !
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Endroit */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Endroit *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ex: McDonald's Champs-Élysées, Parc de la Villette..."
              required
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Sélectionnez un type</option>
              {toiletTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Dangerosité */}
          <StarRating
            rating={formData.dangerRating}
            onRatingChange={handleDangerRatingChange}
            label="Dangerosité *"
          />

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Photo (optionnelle)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="max-w-xs h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Coordinates Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Coordonnées GPS (optionnel)
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {gettingLocation ? 'Localisation...' : (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Ma position
                  </span>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-600 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: 48.8566"
                  step="any"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-600 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: 2.3522"
                  step="any"
                />
              </div>
            </div>
            
            {formData.latitude && formData.longitude && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleOpenInGoogleMaps}
                  className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <Map className="w-4 h-4" />
                  Voir sur Google Maps
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
              placeholder="Décrivez votre expérience dans cet endroit..."
              required
            />
          </div>

          {/* Note de l'endroit */}
          <StarRating
            rating={formData.locationRating}
            onRatingChange={handleLocationRatingChange}
            label="Note de l'endroit *"
          />

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLocation