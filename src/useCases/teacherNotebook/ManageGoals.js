import CanTeacherAccessStudent from '../studentProfiles/CanTeacherAccessStudent';
import TeacherNotebookRepository from '../../repositories/TeacherNotebookRepository';

const VALID_STATUSES = ['Pendiente', 'En progreso', 'Completado'];

/**
 * Use case: Manage student goals
 * Handles create, update, and delete operations with authorization
 */
class ManageGoals {
  /**
   * Validate goal data
   * @param {Object} data
   * @returns {{valid: boolean, data?: Object, error?: string}}
   */
  validate(data) {
    if (!data) {
      return { valid: false, error: 'Datos insuficientes' };
    }

    // Title is required
    if (!data.title || typeof data.title !== 'string') {
      return { valid: false, error: 'El título es obligatorio' };
    }

    const trimmedTitle = data.title.trim();
    if (trimmedTitle.length === 0) {
      return { valid: false, error: 'El título no puede estar vacío' };
    }

    // Status is required and must be valid
    if (!data.status || !VALID_STATUSES.includes(data.status)) {
      return { valid: false, error: 'Estado no válido' };
    }

    // Validate target date if provided
    if (data.targetDate) {
      const date = new Date(data.targetDate);
      if (isNaN(date.getTime())) {
        return { valid: false, error: 'Fecha no válida' };
      }
    }

    return {
      valid: true,
      data: {
        title: trimmedTitle,
        description: data.description ? data.description.trim() : '',
        status: data.status,
        targetDate: data.targetDate || null
      }
    };
  }

  /**
   * Add a new goal
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {Object} data - Goal data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async add(teacherId, studentId, data) {
    // Validate authorization
    const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
    if (!canAccess) {
      return { success: false, error: 'Acceso denegado' };
    }

    // Validate data
    const validation = this.validate(data);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Add goal
    const goal = TeacherNotebookRepository.addGoal(
      teacherId, studentId,
      validation.data.title,
      validation.data.description,
      validation.data.status,
      null, // courseId
      validation.data.targetDate
    );

    if (!goal) {
      return { success: false, error: 'Error guardando objetivo' };
    }

    return { success: true, data: goal };
  }

  /**
   * Update an existing goal
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {string} goalId - Goal ID
   * @param {Object} data - Goal data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async update(teacherId, studentId, goalId, data) {
    // Validate authorization
    const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
    if (!canAccess) {
      return { success: false, error: 'Acceso denegado' };
    }

    // Validate data
    const validation = this.validate(data);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Update goal
    const goal = TeacherNotebookRepository.updateGoal(
      teacherId, studentId, goalId,
      validation.data.title,
      validation.data.description,
      validation.data.status,
      null, // courseId
      validation.data.targetDate
    );

    if (!goal) {
      return { success: false, error: 'Error actualizando objetivo' };
    }

    return { success: true, data: goal };
  }

  /**
   * Delete a goal
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {string} goalId - Goal ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(teacherId, studentId, goalId) {
    // Validate authorization
    const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
    if (!canAccess) {
      return { success: false, error: 'Acceso denegado' };
    }

    // Delete goal
    const deleted = TeacherNotebookRepository.deleteGoal(teacherId, studentId, goalId);

    if (!deleted) {
      return { success: false, error: 'Error eliminando objetivo' };
    }

    return { success: true };
  }
}

export default new ManageGoals();