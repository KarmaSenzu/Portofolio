/**
 * ================================================
 * CLOUDINARY CONFIGURATION
 * ================================================
 * Handles image uploads to Cloudinary CDN
 * Replaces local filesystem storage
 * ================================================
 */

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// ================================================
// VALIDATE ENVIRONMENT VARIABLES
// ================================================

const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required Cloudinary environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file.');
  process.exit(1);
}

// ================================================
// CONFIGURE CLOUDINARY
// ================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// ================================================
// CLOUDINARY STORAGE CONFIGURATION
// ================================================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER || 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' }, // Max dimensions
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format (WebP when supported)
    ],
    // Generate unique filename
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const filename = file.originalname.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
      return `${filename}_${timestamp}_${random}`;
    }
  }
});

// ================================================
// MULTER UPLOAD CONFIGURATION
// ================================================

// Single file upload
const uploadSingle = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type (SECURITY: exclude SVG untuk mencegah stored XSS)
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  }
}).single('image');

// Multiple files upload
const uploadMultiple = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  }
}).array('images', 10);

// ================================================
// HELPER FUNCTIONS
// ================================================

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id (extract from URL)
 * @returns {Promise<object>}
 */
async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Full Cloudinary URL
 * @returns {string} public_id
 */
function extractPublicId(url) {
  if (!url) return null;
  
  // Example URL: https://res.cloudinary.com/cloud-name/image/upload/v123456/portfolio/filename.jpg
  // Extract: portfolio/filename
  
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return matches ? matches[1] : null;
}

/**
 * Generate transformation URL
 * @param {string} publicId - Cloudinary public_id
 * @param {object} options - Transformation options
 * @returns {string} Transformed URL
 */
function getTransformationUrl(publicId, options = {}) {
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  
  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format,
    secure: true
  });
}

/**
 * Test Cloudinary connection
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  try {
    const result = await cloudinary.api.ping();
    if (result.status === 'ok') {
      console.log('✅ Cloudinary connection successful');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

// ================================================
// EXPORTS
// ================================================

module.exports = {
  cloudinary,
  uploadSingle,
  uploadMultiple,
  deleteImage,
  extractPublicId,
  getTransformationUrl,
  testConnection
};
