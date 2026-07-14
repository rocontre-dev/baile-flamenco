import { fetchData } from '../utils/helpers';

/**
 * Student Profile Repository
 * Manages student academic profile data operations
 */
class StudentProfileRepository {
  constructor() {
    this.endpoint = 'studentProfiles.json';
    this.cache = null;
  }

  /**
   * Get all student profiles
   * @returns {Promise<Array>} List of all student profiles
   */
  async getAll() {
    if (this.cache) return this.cache;

    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('StudentProfileRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a student profile by student ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Object|null>} Student profile data or null if not found
   */
  async getByStudentId(studentId) {
    const profiles = await this.getAll();
    const profile = profiles.find(p => p.studentId === studentId);
    return profile || null;
  }
}

export default new StudentProfileRepository();