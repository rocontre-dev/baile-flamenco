import StudentProfileRepository from '../../repositories/StudentProfileRepository';

/**
 * Use case: Get student academic profile
 * Retrieves comprehensive academic profile for a student
 */
class GetStudentProfile {
  /**
   * Execute the use case
   * @param {string} studentId - Student ID
   * @returns {Promise<Object|null>} Student profile data or null if not found
   */
  async execute(studentId) {
    if (!studentId) {
      throw new Error('Student ID is required');
    }
    return await StudentProfileRepository.getByStudentId(studentId);
  }
}

export default new GetStudentProfile();