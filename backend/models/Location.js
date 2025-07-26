const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['WC Publique', 'Dans la nature', 'Chez quelqu\'un', 'Poto', 'Canal', 'Autre'],
      message: 'Type must be one of: WC Publique, Dans la nature, Chez quelqu\'un, Poto, Canal, Autre'
    }
  },
  dangerRating: {
    type: Number,
    required: [true, 'Danger rating is required'],
    min: [1, 'Danger rating must be at least 1'],
    max: [5, 'Danger rating must be at most 5']
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  locationRating: {
    type: Number,
    required: [true, 'Location rating is required'],
    min: [1, 'Location rating must be at least 1'],
    max: [5, 'Location rating must be at most 5']
  }
}, {
  timestamps: true
});

// Add index for faster queries
locationSchema.index({ createdAt: -1 });
locationSchema.index({ type: 1 });
locationSchema.index({ locationRating: -1 });

module.exports = mongoose.model('Location', locationSchema);