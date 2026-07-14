import CanTeacherAccessStudent from '../studentProfiles/CanTeacherAccessStudent';
import TeacherNotebookRepository from '../../repositories/TeacherNotebookRepository';

const VALID_LEVELS = ['Inicial', 'En desarrollo', 'Adecuado', 'Sólido', 'Destacado'];
const REQUIRED_CRITERIA = ['compas', 'coordinacion', 'tecnica', 'memoria', 'expresion'];

/**
 * Use case: Save student assessment
 * Handles saving and updating assessment with authorization
 */
class SaveAssessment {
  /**
   * Validate assessment data
   * @param {Object} data
   * @returns {{valid: boolean, data?: Object, error?: string}}
   */
  validate(data) {
    if (!data) {
      return { valid: false, error: 'Datos insuficientes' };
    }

    // Validate all required criteria
    for (const criterion of REQUIRED_CRITERIA) {
      if (!data[criterion]) {
        return { valid: false, error: `Debe seleccionar ${criterion}` };
      }
      if (!VALID_LEVELS.includes(data[criterion])) {
        return { valid: false, error: `Nivel no válido para ${criterion}` };
      }
    }

    return {
      valid: true,
      data: {
        compas: data.compas,
        coordinacion: data.coordinacion,
        tecnica: data.tecnica,
        memoria: data.memoria,
        expresion: data.expresion,
        comment: data.comment ? data.comment.trim() : ''
      }
    };
  }

  /**
   * Save or update assessment
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @param {Object} data - Assessment data
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

    // Save assessment
    const assessment = TeacherNotebookRepository.saveAssessment(
      teacherId, studentId, validation.data
    );

    if (!assessment) {
      return { success: false, error: 'Error guardando valoración' };
    }

    return { success: true, data: assessment };
  }
}

export default new SaveAssessment();