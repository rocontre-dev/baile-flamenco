import TeacherNotesRepository from '../../repositories/TeacherNotesRepository';

/**
 * Use case: Get teacher notes for a student
 * Returns all observations/notes for a specific student
 */
class GetTeacherNotes {
  /**
   * Execute the use case
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} List of notes for the student, sorted by date descending
   */
  async execute(studentId) {
    return await TeacherNotesRepository.getByStudent(studentId);
  }
}

export default new GetTeacherNotes();