/**
 * ================================================
 * UPLOAD ROUTES - CLOUDINARY INTEGRATION
 * ================================================
 * Handles image uploads to Cloudinary CDN
 * Replaces local filesystem storage
 * ================================================
 */

const express = require('express');
const { verifyAuth } = require('../middleware/supabaseAuth');
const { uploadSingle, uploadMultiple, deleteImage, extractPublicId } = require('../config/cloudinary');

const router = express.Router();

/**
 * POST /api/upload
 * Upload single image to Cloudinary
 * @auth Required
 */
router.post('/', verifyAuth, (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Cloudinary file object
    const file = req.file;

    res.json({
      url: file.path, // Full Cloudinary URL
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      publicId: file.filename, // Cloudinary public_id
      cloudinary: {
        secureUrl: file.path,
        publicId: file.filename,
        format: file.format,
        width: file.width,
        height: file.height
      }
    });
  });
});

/**
 * POST /api/upload/multiple
 * Upload multiple images to Cloudinary
 * @auth Required
 */
router.post('/multiple', verifyAuth, (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      console.error('Multiple upload error:', err);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Too many files. Maximum 10 files allowed.' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const files = req.files.map(file => ({
      url: file.path, // Full Cloudinary URL
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      publicId: file.filename,
      cloudinary: {
        secureUrl: file.path,
        publicId: file.filename,
        format: file.format,
        width: file.width,
        height: file.height
      }
    }));

    res.json({ 
      files: files,
      urls: files.map(f => f.url)
    });
  });
});

/**
 * DELETE /api/upload/:publicId
 * Delete image from Cloudinary
 * @auth Required
 * @param publicId - Can be filename or full Cloudinary public_id
 */
router.delete('/:publicId(*)', verifyAuth, async (req, res) => {
  try {
    let publicId = req.params.publicId;

    // If it's a full URL, extract the public_id
    if (publicId.includes('cloudinary.com')) {
      publicId = extractPublicId(publicId);
    }

    // Validate public_id
    if (!publicId || publicId.includes('..')) {
      return res.status(400).json({ error: 'Invalid public_id.' });
    }

    // Delete from Cloudinary
    const result = await deleteImage(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      res.json({ 
        message: 'File deleted successfully.',
        publicId: publicId,
        result: result.result
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to delete file.',
        details: result
      });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file.',
      message: error.message
    });
  }
});

module.exports = router;
