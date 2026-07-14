import CanTeacherAccessStudent from '../studentProfiles/CanTeacherAccessStudent';
import TeacherNotebookRepository from '../../repositories/TeacherNotebookRepository';

const VALID_STATUSES = ['Pendiente', 'En progreso', 'Completada'];

/**
 * Use case: Manage practice assignments
 * Handles create, update, and delete operations with authorization
 */
class ManageAssignments {
  /**
   * Validate assignment data
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

    // Validate due date if provided
    if (data.dueDate) {
      const date = new Date(data.dueDate);
      if (isNaN(date.getTime())) {
        return { valid: false, error: 'Fecha no válida' };
      }
    }

    return {
      valid: true,
      data: {
        title: trimmedTitle,
        instructions: data.instructions ? data.instructions.trim() : '',
        status: data.status,
        dueDate: data.dueDate || null
      }
    };
  }

  /**
   * Add a new assignment
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {Object} data - Assignment data
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

    // Add assignment
    const assignment = TeacherNotebookRepository.addAssignment(
      teacherId, studentId,
      validation.data.title,
      validation.data.instructions,
      validation.data.status,
      null, // courseId
      null, // lessonId
      validation.data.dueDate
    );

    if (!assignment) {
      return { success: false, error: 'Error guardando tarea' };
    }

    return { success: true, data: assignment };
  }

  /**
   * Update an existing assignment
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {string} assignmentId - Assignment ID
   * @param {Object} data - Assignment data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async update(teacherId, studentId, assignmentId, data) {
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

    // Update assignment
    const assignment = TeacherNotebookRepository.updateAssignment(
      teacherId, studentId, assignmentId,
      validation.data.title,
      validation.data.instructions,
      validation.data.status,
      null, // courseId
      null, // lessonId
      validation.data.dueDate
    );

    if (!assignment) {
      return { success: false, error: 'Error actualizando tarea' };
    }

    return { success: true, data: assignment };
  }

  /**
   * Delete an assignment
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {string} assignmentId - Assignment ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(teacherId, studentId, assignmentId) {
    // Validate authorization
    const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
    if (!canAccess) {
      return { success: false, error: 'Acceso denegado' };
    }

    // Delete assignment
    const deleted = TeacherNotebookRepository.deleteAssignment(teacherId, studentId, assignmentId);

    if (!deleted) {
      return { success: false, error: 'Error eliminando tarea' };
    }

    return { success: true };
  }
}

export default new ManageAssignments();