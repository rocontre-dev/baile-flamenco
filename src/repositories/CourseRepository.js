import { fetchData } from '../utils/helpers';

/**
 * Repository for course data access
 * Responsible only for fetching data, no business logic
 */
class CourseRepository {
  constructor() {
    this.endpoint = 'cursos.json';
    this.cache = null;
  }

  /**
   * Fetch all courses
   * @returns {Promise<Array>} List of all courses
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('CourseRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a course by ID
   * @param {string} id - Course ID
   * @returns {Promise<Object|null>} Course object or null if not found
   */
  async getById(id) {
    const courses = await this.getAll();
    return courses.find(course => course.id === id) || null;
  }

  /**
   * Get a course by slug
   * @param {string} slug - Course slug
   * @returns {Promise<Object|null>} Course object or null if not found
   */
  async getBySlug(slug) {
    const courses = await this.getAll();
    return courses.find(course => course.slug === slug) || null;
  }

  /**
   * Get courses by level
   * @param {string} level - Course level (Principiante, Intermedio, Avanzado)
   * @returns {Promise<Array>} List of courses matching the level
   */
  async getByLevel(level) {
    const courses = await this.getAll();
    return courses.filter(course => course.nivel === level);
  }

  /**
   * Get active courses only
   * @returns {Promise<Array>} List of active courses
   */
  async getActive() {
    const courses = await this.getAll();
    return courses.filter(course => course.activo !== false);
  }

  /**
   * Clear the cache (useful when data is updated)
   */
  clearCache() {
    this.cache = null;
  }
}

export default new CourseRepository();