import CanTeacherAccessStudent from '../studentProfiles/CanTeacherAccessStudent';
import GetStudent from '../students/GetStudent';
import TeacherNotebookRepository from '../../repositories/TeacherNotebookRepository';

/**
 * Use case: Get teacher notebook for a specific student
 * Validates authorization before returning data
 */
class GetTeacherNotebook {
  /**
   * Execute the use case
   * @param {string} teacherId - Authenticated teacher ID
   * @param {string} studentId - Student ID from route
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async execute(teacherId, studentId) {
    // Validate required parameters
    if (!teacherId || !studentId) {
      return { success: false, error: 'Datos insuficientes' };
    }

    try {
      // First check if student exists
      const student = await GetStudent.execute(studentId);
      if (!student) {
        return { success: false, error: 'Alumno no encontrado' };
      }

      // Then check authorization
      const canAccess = await CanTeacherAccessStudent.execute(teacherId, studentId);
      if (!canAccess) {
        return { success: false, error: 'Acceso denegado' };
      }

      // Get notebook data
      const notebook = TeacherNotebookRepository.getNotebook(teacherId, studentId);

      return {
        success: true,
        data: {
          student,
          notebook
        }
      };
    } catch (error) {
      console.error('GetTeacherNotebook error:', error);
      return { success: false, error: 'Error cargando datos' };
    }
  }
}

export default new GetTeacherNotebook();