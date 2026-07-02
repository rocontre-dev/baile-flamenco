/**
 * Helper functions for the Tibiritábara platform
 */

/**
 * Fetches data from a JSON file
 * @param {string} filename - Name of the JSON file in the data directory
 * @returns {Promise<any>} Parsed JSON data
 */
export const fetchData = async (filename) => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    throw error;
  }
};

/**
 * Generates a URL-friendly slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Formats a duration string (MM:SS) to seconds
 * @param {string} duration - Duration in MM:SS format
 * @returns {number} Duration in seconds
 */
export const formatDurationToSeconds = (duration) => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
};

/**
 * Formats seconds to a duration string (MM:SS)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Duration in MM:SS format
 */
export const formatSecondsToDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Gets the asset URL for an image
 * @param {string} filename - Image filename
 * @param {string} type - Type of asset (images, videos, audio, textures)
 * @returns {string} Full URL to the asset
 */
export const getAssetUrl = (filename, type = 'images') => {
  return `/assets/${type}/${filename}`;
};

/**
 * Checks if an element is in the viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttles a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Clamps a value between a minimum and maximum
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generates a unique ID (simple version)
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default {
  fetchData,
  slugify,
  formatDurationToSeconds,
  formatSecondsToDuration,
  getAssetUrl,
  isInViewport,
  debounce,
  throttle,
  clamp,
  generateId
};