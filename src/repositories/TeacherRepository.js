import { mockTeachers } from '../data/mockTeachers';

/**
 * Teacher Repository
 * Manages teacher data operations (mock only - no backend)
 */
class TeacherRepository {
  /**
   * Get all teachers
   * @returns {Promise<Array>} List of all teachers
   */
  async getAll() {
    return mockTeachers;
  }

  /**
   * Get a teacher by ID
   * @param {string} id - Teacher ID
   * @returns {Promise<Object|null>} Teacher data or null if not found
   */
  async getById(id) {
    const teacher = mockTeachers.find(t => t.id === id);
    return teacher || null;
  }

  /**
   * Get teacher's courses
   * @param {string} teacherId - Teacher ID
   * @returns {Promise<Array>} List of course IDs
   */
  async getCourses(teacherId) {
    const teacher = await this.getById(teacherId);
    return teacher ? teacher.assignedCourseIds : [];
  }
}

export default new TeacherRepository();