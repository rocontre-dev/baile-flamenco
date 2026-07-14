import CanTeacherAccessStudent from '../studentProfiles/CanTeacherAccessStudent';
import TeacherNotebookRepository from '../../repositories/TeacherNotebookRepository';

const MIN_LENGTH = 3;
const MAX_LENGTH = 1000;

/**
 * Use case: Manage teacher observations for a student
 * Handles create, update, and delete operations with authorization
 */
class ManageObservations {
  /**
   * Validate observation text
   * @param {string} text
   * @returns {{valid: boolean, text?: string, error?: string}}
   */
  validateText(text) {
    if (!text || typeof text !== 'string') {
      return { valid: false, error: 'El texto es obligatorio' };
    }

    const trimmed = text.trim();

    if (trimmed.length < MIN_LENGTH) {
      return { valid: false, error: `Mínimo ${MIN_LENGTH} caracteres` };
    }

    if (trimmed.length > MAX_LENGTH) {
      return { valid: false, error: `Máximo ${MAX_LENGTH} caracteres` };
    }

    return { valid: true, text: trimmed };
  }

  /**
   * Add a new observation
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {string} text - Observation text
   * @param {string} [courseId] - Optional course ID
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async add(teacherId, studentId, text, courseId = null) {
    // Validate authorization
    const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
    if (!canAccess) {
      return { success: false, error: 'Acceso denegado' };
    }

    // Validate text
    const validation = this.validateText(text);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Add observation
    const observation = TeacherNotebookRepository.addObservation(
      teacherId, studentId, validation.text, courseId
    );

    if (!observation) {
      return { success: false, error: 'Error guardando observación' };
    }

    return { success: true, data: observation };
  }

  /**
   * Update an existing observation
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {string} observationId - Observation ID
   * @param {string} text - New observation text
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async update(teacherId, studentId, observationId, text) {
    // Validate authorization
    const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
    if (!canAccess) {
      return { success: false, error: 'Acceso denegado' };
    }

    // Validate text
    const validation = this.validateText(text);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Update observation
    const observation = TeacherNotebookRepository.updateObservation(
      teacherId, studentId, observationId, validation.text
    );

    if (!observation) {
      return { success: false, error: 'Error actualizando observación' };
    }

    return { success: true, data: observation };
  }

  /**
   * Delete an observation
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {string} observationId - Observation ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(teacherId, studentId, observationId) {
    // Validate authorization
    const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
    if (!canAccess) {
      return { success: false, error: 'Acceso denegado' };
    }

    // Delete observation
    const deleted = TeacherNotebookRepository.deleteObservation(
      teacherId, studentId, observationId
    );

    if (!deleted) {
      return { success: false, error: 'Error eliminando observación' };
    }

    return { success: true };
  }
}

export default new ManageObservations();