import { mockStudents } from '../data/mockStudents';

/**
 * Student Repository
 * Manages student data operations (mock only - no backend)
 */
class StudentRepository {
  /**
   * Get all students
   * @returns {Promise<Array>} List of all students
   */
  async getAll() {
    return mockStudents;
  }

  /**
   * Get a student by ID
   * @param {string} id - Student ID
   * @returns {Promise<Object|null>} Student data or null if not found
   */
  async getById(id) {
    const student = mockStudents.find(s => s.id === id);
    return student || null;
  }

  /**
   * Search students by name
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered list of students
   */
  async search(query) {
    const lowerQuery = query.toLowerCase();
    return mockStudents.filter(s => 
      s.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter students by level
   * @param {string} level - Level to filter by
   * @returns {Promise<Array>} Filtered list of students
   */
  async getByLevel(level) {
    return mockStudents.filter(s => s.level === level);
  }

  /**
   * Get students count by level
   * @returns {Promise<Object>} Count of students per level
   */
  async getCountByLevel() {
    const counts = {
      Principiante: 0,
      Intermedio: 0,
      Avanzado: 0
    };
    
    mockStudents.forEach(s => {
      if (counts.hasOwnProperty(s.level)) {
        counts[s.level]++;
      }
    });
    
    return counts;
  }
}

export default new StudentRepository();