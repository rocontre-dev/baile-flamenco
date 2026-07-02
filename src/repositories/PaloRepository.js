import { fetchData } from '../utils/helpers';

/**
 * Repository for palo (flamenco style) data access
 * Responsible only for fetching data, no business logic
 */
class PaloRepository {
  constructor() {
    this.endpoint = 'palos.json';
    this.cache = null;
  }

  /**
   * Fetch all palos
   * @returns {Promise<Array>} List of all palos
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('PaloRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a palo by ID
   * @param {string} id - Palo ID
   * @returns {Promise<Object|null>} Palo object or null if not found
   */
  async getById(id) {
    const palos = await this.getAll();
    return palos.find(palo => palo.id === id) || null;
  }

  /**
   * Get a palo by slug
   * @param {string} slug - Palo slug
   * @returns {Promise<Object|null>} Palo object or null if not found
   */
  async getBySlug(slug) {
    const palos = await this.getAll();
    return palos.find(palo => palo.slug === slug) || null;
  }

  /**
   * Get active palos only
   * @returns {Promise<Array>} List of active palos
   */
  async getActive() {
    const palos = await this.getAll();
    return palos.filter(palo => palo.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new PaloRepository();