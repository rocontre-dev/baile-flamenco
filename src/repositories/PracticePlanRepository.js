import { mockPracticePlans } from '../data/mockPracticePlans';

/**
 * Practice Plan Repository
 * Manages practice plan data operations (mock only - no backend)
 */
class PracticePlanRepository {
  // Priority order for sorting (Alta > Media > Baja)
  priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };

  /**
   * Get all practice plans for a specific student
   * Sorted by priority (Alta first) and then by due date
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} List of practice plans for the student
   */
  async getByStudent(studentId) {
    return mockPracticePlans
      .filter(plan => plan.studentId === studentId)
      .sort((a, b) => {
        // First sort by priority
        const priorityDiff = (this.priorityOrder[a.priority] || 4) - (this.priorityOrder[b.priority] || 4);
        if (priorityDiff !== 0) return priorityDiff;
        // Then by due date
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  }

  /**
   * Get a practice plan by ID
   * @param {string} id - Plan ID
   * @returns {Promise<Object|null>} Plan data or null if not found
   */
  async getById(id) {
    const plan = mockPracticePlans.find(p => p.id === id);
    return plan || null;
  }

  /**
   * Add a new practice plan (in-memory only - no persistence)
   * @param {Object} plan - Plan data to add
   * @returns {Promise<Object>} The added plan
   */
  async add(plan) {
    mockPracticePlans.push(plan);
    return plan;
  }

  /**
   * Update an existing practice plan (in-memory only - no persistence)
   * @param {Object} plan - Updated plan data
   * @returns {Promise<Object|null>} Updated plan or null if not found
   */
  async update(plan) {
    const index = mockPracticePlans.findIndex(p => p.id === plan.id);
    if (index !== -1) {
      mockPracticePlans[index] = { ...mockPracticePlans[index], ...plan };
      return mockPracticePlans[index];
    }
    return null;
  }

  /**
   * Delete a practice plan (in-memory only - no persistence)
   * @param {string} id - Plan ID to delete
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    const index = mockPracticePlans.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPracticePlans.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get practice plans by teacher ID
   * @param {string} teacherId - Teacher ID
   * @returns {Promise<Array>} List of practice plans by the teacher
   */
  async getByTeacher(teacherId) {
    return mockPracticePlans
      .filter(plan => plan.teacherId === teacherId)
      .sort((a, b) => {
        const priorityDiff = (this.priorityOrder[a.priority] || 4) - (this.priorityOrder[b.priority] || 4);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  }
}

export default new PracticePlanRepository();