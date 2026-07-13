import { fetchData } from '../utils/helpers';

/**
 * Repository for student progress data access
 * Responsible only for fetching data, no business logic
 */
class ProgressRepository {
  constructor() {
    this.endpoint = 'progresos.json';
    this.cache = null;
  }

  /**
   * Fetch all progress records
   * @returns {Promise<Array>} List of all progress records
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('ProgressRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a progress record by ID
   * @param {string} id - Progress ID
   * @returns {Promise<Object|null>} Progress object or null if not found
   */
  async getById(id) {
    const progressRecords = await this.getAll();
    return progressRecords.find(record => record.id === id) || null;
  }

  /**
   * Get progress by student ID
   * @param {string} alumnoId - Student ID
   * @returns {Promise<Array>} List of progress records for the student
   */
  async getByStudent(alumnoId) {
    const progressRecords = await this.getAll();
    return progressRecords.filter(record => record.alumnoId === alumnoId);
  }

  /**
   * Get progress by exercise ID
   * @param {string} ejercicioId - Exercise ID
   * @returns {Promise<Array>} List of progress records for the exercise
   */
  async getByExercise(ejercicioId) {
    const progressRecords = await this.getAll();
    return progressRecords.filter(record => record.ejercicioId === ejercicioId);
  }

  /**
   * Get progress by lesson ID
   * @param {string} leccionId - Lesson ID
   * @returns {Promise<Array>} List of progress records for the lesson
   */
  async getByLesson(leccionId) {
    const progressRecords = await this.getAll();
    return progressRecords.filter(record => record.leccionId === leccionId);
  }

  /**
   * Get progress by student and exercise
   * @param {string} alumnoId - Student ID
   * @param {string} ejercicioId - Exercise ID
   * @returns {Promise<Object|null>} Progress object or null if not found
   */
  async getByStudentAndExercise(alumnoId, ejercicioId) {
    const progressRecords = await this.getAll();
    return progressRecords.find(
      record => record.alumnoId === alumnoId && record.ejercicioId === ejercicioId
    ) || null;
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new ProgressRepository();