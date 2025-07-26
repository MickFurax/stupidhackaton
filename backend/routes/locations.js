const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Location = require('../models/Location');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'toilet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET /api/locations - Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
});

// GET /api/locations/:id - Get single location
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).select('-__v');
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
});

// POST /api/locations - Create new location
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      location,
      type,
      dangerRating,
      description,
      locationRating
    } = req.body;

    // Validate required fields
    if (!location || !type || !dangerRating || !description || !locationRating) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create location object
    const locationData = {
      location: location.trim(),
      type,
      dangerRating: parseInt(dangerRating),
      description: description.trim(),
      locationRating: parseInt(locationRating)
    };

    // Add image path if uploaded
    if (req.file) {
      locationData.image = req.file.filename;
    }

    const newLocation = new Location(locationData);
    const savedLocation = await newLocation.save();

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: savedLocation
    });
  } catch (error) {
    console.error('Error creating location:', error);
    
    // Delete uploaded file if location creation failed
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating location',
      error: error.message
    });
  }
});

// DELETE /api/locations/:id - Delete location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Delete associated image file if exists
    if (location.image) {
      const imagePath = path.join(__dirname, '../uploads', location.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Location.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting location',
      error: error.message
    });
  }
});

// GET /api/locations/stats/summary - Get summary statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalLocations = await Location.countDocuments();
    const typeStats = await Location.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgRating: { $avg: '$locationRating' },
          avgDanger: { $avg: '$dangerRating' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalLocations,
        typeStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;