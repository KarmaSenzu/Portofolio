/**
 * ================================================
 * UPLOAD SERVICE - CLOUDINARY INTEGRATION
 * ================================================
 * Handles image uploads to Cloudinary CDN
 * Supports both Cloudinary and legacy local URLs
 * ================================================
 */

import { api } from './api';

export const uploadService = {
  /**
   * Upload single image
   * Backend handles Cloudinary upload and returns full URL
   */
  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload('/upload', formData);
  },

  /**
   * Upload multiple images
   * Backend handles Cloudinary upload and returns array of URLs
   */
  async uploadMultiple(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.upload('/upload/multiple', formData);
  },

  /**
   * Delete image
   * @param {string} filename - Can be Cloudinary public_id or full URL
   */
  async deleteFile(filename) {
    // Encode filename to handle Cloudinary paths with slashes
    const encoded = encodeURIComponent(filename);
    return api.delete(`/upload/${encoded}`);
  },

  /**
   * Get full image URL
   * Handles Cloudinary URLs, legacy local URLs, and relative paths
   * 
   * @param {string} path - Image path or URL
   * @returns {string|null} Full image URL
   */
  getImageUrl(path) {
    if (!path) return null;
    
    // Already a full URL (Cloudinary or external)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Legacy local uploads (backward compatibility)
    if (path.startsWith('/uploads')) {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      if (apiUrl.startsWith('http')) {
        // Development: prepend backend server URL
        const serverBase = apiUrl.replace(/\/api$/, '');
        return `${serverBase}${path}`;
      }
      // Production: relative path works with nginx proxy
      return path;
    }
    
    // Assume it's already a valid path
    return path;
  },

  /**
   * Get Cloudinary transformation URL
   * Useful for responsive images and optimization
   * 
   * @param {string} url - Original Cloudinary URL
   * @param {object} options - Transformation options
   * @returns {string} Transformed URL
   */
  getTransformationUrl(url, options = {}) {
    if (!url || !url.includes('cloudinary.com')) {
      return url; // Not a Cloudinary URL, return as-is
    }

    const { width, height, quality = 'auto', format = 'auto' } = options;
    
    // Insert transformations into Cloudinary URL
    // Example: https://res.cloudinary.com/cloud/upload/v123/img.jpg
    // Becomes: https://res.cloudinary.com/cloud/upload/w_800,h_600,q_auto,f_auto/v123/img.jpg
    
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    
    if (transformations.length === 0) return url;
    
    const transformStr = transformations.join(',');
    return url.replace('/upload/', `/upload/${transformStr}/`);
  }
};
