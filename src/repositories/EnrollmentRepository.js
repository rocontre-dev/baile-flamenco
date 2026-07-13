import { fetchData } from '../utils/helpers';

/**
 * Repository for enrollment data access
 * Responsible only for fetching data, no business logic
 */
class EnrollmentRepository {
  constructor() {
    this.endpoint = 'inscripciones.json';
    this.cache = null;
  }

  /**
   * Fetch all enrollments
   * @returns {Promise<Array>} List of all enrollments
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('EnrollmentRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get an enrollment by ID
   * @param {string} id - Enrollment ID
   * @returns {Promise<Object|null>} Enrollment object or null if not found
   */
  async getById(id) {
    const enrollments = await this.getAll();
    return enrollments.find(enrollment => enrollment.id === id) || null;
  }

  /**
   * Get enrollments by student ID
   * @param {string} alumnoId - Student ID
   * @returns {Promise<Array>} List of enrollments for the student
   */
  async getByStudent(alumnoId) {
    const enrollments = await this.getAll();
    return enrollments.filter(enrollment => enrollment.alumnoId === alumnoId);
  }

  /**
   * Get enrollments by course ID
   * @param {string} cursoId - Course ID
   * @returns {Promise<Array>} List of enrollments for the course
   */
  async getByCourse(cursoId) {
    const enrollments = await this.getAll();
    return enrollments.filter(enrollment => enrollment.cursoId === cursoId);
  }

  /**
   * Get active enrollments only
   * @returns {Promise<Array>} List of active enrollments
   */
  async getActive() {
    const enrollments = await this.getAll();
    return enrollments.filter(enrollment => enrollment.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new EnrollmentRepository();