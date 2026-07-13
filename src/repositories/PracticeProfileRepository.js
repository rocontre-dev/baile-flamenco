import { fetchData } from '../utils/helpers';

/**
 * Repository for practice profile data access
 * Responsible only for fetching data, no business logic
 */
class PracticeProfileRepository {
  constructor() {
    this.endpoint = 'practiceProfiles.json';
    this.cache = null;
  }

  /**
   * Fetch all practice profiles
   * @returns {Promise<Array>} List of all practice profiles
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('PracticeProfileRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a practice profile by ID
   * @param {string} id - Practice profile ID
   * @returns {Promise<Object|null>} Practice profile object or null if not found
   */
  async getById(id) {
    const profiles = await this.getAll();
    return profiles.find(profile => profile.id === id) || null;
  }

  /**
   * Get practice profile by student ID
   * @param {string} alumnoId - Student ID
   * @returns {Promise<Object|null>} Practice profile object or null if not found
   */
  async getByStudent(alumnoId) {
    const profiles = await this.getAll();
    return profiles.find(profile => profile.alumnoId === alumnoId) || null;
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new PracticeProfileRepository();