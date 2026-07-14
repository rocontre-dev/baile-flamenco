import StudentRepository from '../../repositories/StudentRepository';

/**
 * Use case: Get a single student by ID
 */
class GetStudent {
  /**
   * Execute the use case
   * @param {string} studentId - Student ID
   * @returns {Promise<Object|null>} Student data or null if not found
   */
  async execute(studentId) {
    if (!studentId) {
      throw new Error('Student ID is required');
    }
    return await StudentRepository.getById(studentId);
  }
}

export default new GetStudent();