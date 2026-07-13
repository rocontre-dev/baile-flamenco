import { fetchData } from '../utils/helpers';

/**
 * Repository for student data access
 * Responsible only for fetching data, no business logic
 */
class StudentRepository {
  constructor() {
    this.endpoint = 'alumnos.json';
    this.cache = null;
  }

  /**
   * Fetch all students
   * @returns {Promise<Array>} List of all students
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('StudentRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a student by ID
   * @param {string} id - Student ID
   * @returns {Promise<Object|null>} Student object or null if not found
   */
  async getById(id) {
    const students = await this.getAll();
    return students.find(student => student.id === id) || null;
  }

  /**
   * Get active students only
   * @returns {Promise<Array>} List of active students
   */
  async getActive() {
    const students = await this.getAll();
    return students.filter(student => student.activo !== false);
  }

  /**
   * Get students by level
   * @param {string} level - Student level
   * @returns {Promise<Array>} List of students matching the level
   */
  async getByLevel(level) {
    const students = await this.getAll();
    return students.filter(student => student.nivel === level);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new StudentRepository();