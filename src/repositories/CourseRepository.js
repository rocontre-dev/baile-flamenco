import { fetchData } from '../utils/helpers';

/**
 * Course Repository
 * Manages course data operations from public/data/cursos.json
 * Updated to use fetchData instead of mock data
 */
class CourseRepository {
  constructor() {
    this.endpoint = 'cursos.json';
    this.cache = null;
  }

  /**
   * Get all courses
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
   * @returns {Promise<Object|null>} Course data or null if not found
   */
  async getById(id) {
    const courses = await this.getAll();
    const course = courses.find(c => c.id === id);
    return course || null;
  }

  /**
   * Get courses by level
   * @param {string} level - Level to filter by
   * @returns {Promise<Array>} Filtered list of courses
   */
  async getByLevel(level) {
    const courses = await this.getAll();
    return courses.filter(c => c.nivel === level);
  }

  /**
   * Get courses by teacher ID
   * @param {string} teacherId - Teacher ID
   * @returns {Promise<Array>} Filtered list of courses
   */
  async getByTeacher(teacherId) {
    const courses = await this.getAll();
    return courses.filter(c => c.profesorId === teacherId);
  }

  /**
   * Get active courses only
   * @returns {Promise<Array>} List of active courses
   */
  async getActive() {
    const courses = await this.getAll();
    return courses.filter(c => c.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new CourseRepository();