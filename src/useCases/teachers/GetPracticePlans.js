import PracticePlanRepository from '../../repositories/PracticePlanRepository';

/**
 * Use case: Get practice plans for a student
 * Returns all practice objectives for a specific student, sorted by priority and due date
 */
class GetPracticePlans {
  /**
   * Execute the use case
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} List of practice plans for the student
   */
  async execute(studentId) {
    return await PracticePlanRepository.getByStudent(studentId);
  }
}

export default new GetPracticePlans();