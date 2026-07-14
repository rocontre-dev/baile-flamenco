import { fetchData } from '../utils/helpers';

/**
 * Teacher Repository
 * Manages teacher data operations from public/data/profesores.json
 * Updated to use fetchData instead of mock data
 */
class TeacherRepository {
  constructor() {
    this.endpoint = 'profesores.json';
    this.cache = null;
  }

  /**
   * Get all teachers
   * @returns {Promise<Array>} List of all teachers
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('TeacherRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a teacher by ID
   * @param {string} id - Teacher ID
   * @returns {Promise<Object|null>} Teacher data or null if not found
   */
  async getById(id) {
    const teachers = await this.getAll();
    const teacher = teachers.find(t => t.id === id);
    return teacher || null;
  }

  /**
   * Get teacher's courses
   * @param {string} teacherId - Teacher ID
   * @returns {Promise<Array>} List of course IDs
   */
  async getCourses(teacherId) {
    const teacher = await this.getById(teacherId);
    return teacher ? teacher.cursosAsignados || [] : [];
  }

  /**
   * Get active teachers only
   * @returns {Promise<Array>} List of active teachers
   */
  async getActive() {
    const teachers = await this.getAll();
    return teachers.filter(t => t.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new TeacherRepository();