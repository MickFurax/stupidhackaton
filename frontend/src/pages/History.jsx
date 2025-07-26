import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { openInGoogleMaps, formatCoordinates, areValidCoordinates, getDirectionsUrl } from '../utils/maps'
import axios from 'axios'


const History = () => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const response = await axios.get(`${apiUrl}/locations`)
      setLocations(response.data.data || [])
    } catch (err) {
      console.error('Error fetching locations:', err)
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeEmoji = (type) => {
    const emojiMap = {
      'WC Publique': '🏢',
      'Dans la nature': '🌳',
      'Chez quelqu\'un': '🏠',
      'Poto': '🍺',
      'Canal': '🚤',
      'Autre': '❓'
    }
    return emojiMap[type] || '❓'
  }

  const getDangerColor = (rating) => {
    if (rating <= 2) return 'text-green-600'
    if (rating <= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-danger-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchLocations}
            className="btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Historique des endroits
          </h1>
          <p className="text-gray-600">
            Découvrez tous les endroits notés par la communauté
          </p>
        </div>
        {/* Add new location button */}
        <div className="text-center">
          <Link to="/add" className="btn-primary">
          💩 Ajouter un nouvel endroit
          </Link>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚽</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Aucun endroit pour le moment
          </h2>
          <p className="text-gray-600 mb-8">
            Soyez le premier à partager votre expérience !
          </p>
          <Link to="/add" className="btn-primary">
            Ajouter le premier endroit
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 text-right">
            <span className="text-gray-600">
              {locations.length} endroit{locations.length > 1 ? 's' : ''} trouvé{locations.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <div key={location._id} className="card overflow-hidden">
                {/* Image */}
                {location.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/images/${location.image}`}
                      alt={location.location}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Location and Type */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {location.location}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="text-lg">{getTypeEmoji(location.type)}</span>
                      <span>{location.type}</span>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Note générale</span>
                        <span className={`text-sm font-semibold ${getRatingColor(location.locationRating)}`}>
                          {location.locationRating}/5
                        </span>
                      </div>
                      <StarRating
                        rating={location.locationRating}
                        disabled={true}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Dangerosité</span>
                        <span className={`text-sm font-semibold ${getDangerColor(location.dangerRating)}`}>
                          {location.dangerRating}/5
                        </span>
                      </div>
                      <StarRating
                        rating={location.dangerRating}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {location.description}
                    </p>
                  </div>

                  {/* Coordinates and Maps */}
                  {location.coordinates && areValidCoordinates(location.coordinates.latitude, location.coordinates.longitude) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-700 block mb-1">Coordonnées GPS:</span>
                        <span className="text-xs text-gray-600 font-mono">
                          {formatCoordinates(location.coordinates.latitude, location.coordinates.longitude, 4)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openInGoogleMaps(
                            location.coordinates.latitude,
                            location.coordinates.longitude,
                            location.location
                          )}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors duration-200"
                        >
                          🗺️ Voir sur Maps
                        </button>
                        <a
                          href={getDirectionsUrl(location.coordinates.latitude, location.coordinates.longitude)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition-colors duration-200 inline-block"
                        >
                          🧭 Itinéraire
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className="text-xs text-gray-500 border-t pt-3">
                    Ajouté le {formatDate(location.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          
        </>
      )}
    </div>
  )
}

export default History