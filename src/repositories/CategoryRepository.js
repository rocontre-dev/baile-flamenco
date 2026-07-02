import { fetchData } from '../utils/helpers';

/**
 * Repository for category data access
 * Responsible only for fetching data, no business logic
 */
class CategoryRepository {
  constructor() {
    this.endpoint = 'categorias.json';
    this.cache = null;
  }

  /**
   * Fetch all categories
   * @returns {Promise<Array>} List of all categories
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('CategoryRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object|null>} Category object or null if not found
   */
  async getById(id) {
    const categories = await this.getAll();
    return categories.find(cat => cat.id === id) || null;
  }

  /**
   * Get a category by slug
   * @param {string} slug - Category slug
   * @returns {Promise<Object|null>} Category object or null if not found
   */
  async getBySlug(slug) {
    const categories = await this.getAll();
    return categories.find(cat => cat.slug === slug) || null;
  }

  /**
   * Get categories by palo ID
   * @param {string} paloId - Palo ID
   * @returns {Promise<Array>} List of categories for the palo
   */
  async getByPalo(paloId) {
    const categories = await this.getAll();
    return categories
      .filter(cat => cat.paloId === paloId)
      .sort((a, b) => a.orden - b.orden);
  }

  /**
   * Get active categories only
   * @returns {Promise<Array>} List of active categories
   */
  async getActive() {
    const categories = await this.getAll();
    return categories.filter(cat => cat.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new CategoryRepository();