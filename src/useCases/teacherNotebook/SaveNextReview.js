import CanTeacherAccessStudent from '../studentProfiles/CanTeacherAccessStudent';
import TeacherNotebookRepository from '../../repositories/TeacherNotebookRepository';

/**
 * Use case: Save next review date
 * Handles saving and updating next review with authorization
 */
class SaveNextReview {
  /**
   * Validate next review data
   * @param {Object} data
   * @returns {{valid: boolean, data?: Object, error?: string}}
   */
  validate(data) {
    if (!data) {
      return { valid: false, error: 'Datos insuficientes' };
    }

    // Date is required
    if (!data.date) {
      return { valid: false, error: 'La fecha es obligatoria' };
    }

    // Validate date format
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Fecha no válida' };
    }

    return {
      valid: true,
      data: {
        date: data.date,
        note: data.note ? data.note.trim() : ''
      }
    };
  }

  /**
   * Save or update next review
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {Object} data - Next review data
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async execute(teacherId, studentId, data) {
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

    // Save next review
    const nextReview = TeacherNotebookRepository.saveNextReview(
      teacherId, studentId, validation.data.date, validation.data.note
    );

    if (!nextReview) {
      return { success: false, error: 'Error guardando próxima revisión' };
    }

    return { success: true, data: nextReview };
  }
}

export default new SaveNextReview();