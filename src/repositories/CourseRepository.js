import { mockCourses } from '../data/mockCourses';

/**
 * Course Repository
 * Manages course data operations (mock only - no backend)
 */
class CourseRepository {
  /**
   * Get all courses
   * @returns {Promise<Array>} List of all courses
   */
  async getAll() {
    return mockCourses;
  }

  /**
   * Get a course by ID
   * @param {string} id - Course ID
   * @returns {Promise<Object|null>} Course data or null if not found
   */
  async getById(id) {
    const course = mockCourses.find(c => c.id === id);
    return course || null;
  }

  /**
   * Get courses by level
   * @param {string} level - Level to filter by
   * @returns {Promise<Array>} Filtered list of courses
   */
  async getByLevel(level) {
    return mockCourses.filter(c => c.level === level);
  }

  /**
   * Get courses by teacher ID
   * @param {string} teacherId - Teacher ID
   * @returns {Promise<Array>} Filtered list of courses
   */
  async getByTeacher(teacherId) {
    return mockCourses.filter(c => c.teacherId === teacherId);
  }

  /**
   * Get courses count by level
   * @returns {Promise<Object>} Count of courses per level
   */
  async getCountByLevel() {
    const counts = {
      Principiante: 0,
      Intermedio: 0,
      Avanzado: 0
    };
    
    mockCourses.forEach(c => {
      if (counts.hasOwnProperty(c.level)) {
        counts[c.level]++;
      }
    });
    
    return counts;
  }
}

export default new CourseRepository();