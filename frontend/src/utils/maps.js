/**
 * Google Maps integration utilities
 */

/**
 * Opens Google Maps with the given coordinates
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @param {string} label - Optional label for the location
 */
export const openInGoogleMaps = (latitude, longitude, label = '') => {
  if (!latitude || !longitude) {
    console.error('Invalid coordinates provided to openInGoogleMaps');
    return;
  }

  let url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  if (label) {
    // Encode the label to make it URL-safe
    const encodedLabel = encodeURIComponent(label);
    url = `https://www.google.com/maps?q=${encodedLabel}@${latitude},${longitude}`;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Generates a Google Maps URL for the given coordinates
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @param {string} label - Optional label for the location
 * @returns {string} The Google Maps URL
 */
export const getGoogleMapsUrl = (latitude, longitude, label = '') => {
  if (!latitude || !longitude) {
    return null;
  }

  let url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  if (label) {
    const encodedLabel = encodeURIComponent(label);
    url = `https://www.google.com/maps?q=${encodedLabel}@${latitude},${longitude}`;
  }

  return url;
};

/**
 * Generates a Google Maps directions URL from current location to target coordinates
 * @param {number} latitude - The target latitude coordinate
 * @param {number} longitude - The target longitude coordinate
 * @returns {string} The Google Maps directions URL
 */
export const getDirectionsUrl = (latitude, longitude) => {
  if (!latitude || !longitude) {
    return null;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
};

/**
 * Formats coordinates for display
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @param {number} decimals - Number of decimal places to show (default: 6)
 * @returns {string} Formatted coordinates string
 */
export const formatCoordinates = (latitude, longitude, decimals = 6) => {
  if (!latitude || !longitude) {
    return 'Coordonnées non disponibles';
  }

  const lat = parseFloat(latitude).toFixed(decimals);
  const lng = parseFloat(longitude).toFixed(decimals);
  
  return `${lat}, ${lng}`;
};

/**
 * Checks if coordinates are valid
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {boolean} True if coordinates are valid
 */
export const areValidCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180;
};

/**
 * Gets current user location using geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>} Promise that resolves with coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Error getting current location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for Geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};