import CourseRepository from '../../repositories/CourseRepository';
import StudentRepository from '../../repositories/StudentRepository';
import EnrollmentRepository from '../../repositories/EnrollmentRepository';
import LessonRepository from '../../repositories/LessonRepository';
import ExerciseRepository from '../../repositories/ExerciseRepository';
import TeacherRepository from '../../repositories/TeacherRepository';

/**
 * Use case: Get dashboard data for teacher
 * Returns information related to the academy's courses, students, and content
 * Updated to use repositories connected to public/data/ JSON files
 */
class GetTeacherDashboardData {
  async execute() {
    // Get all data from repositories
    const [courses, students, enrollments, lessons, exercises, teachers] = await Promise.all([
      CourseRepository.getAll(),
      StudentRepository.getAll(),
      EnrollmentRepository.getAll(),
      LessonRepository.getAll(),
      ExerciseRepository.getActive(),
      TeacherRepository.getAll()
    ]);

    // Calculate metrics
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.activo !== false).length;
    const totalCourses = courses.length;
    const totalLessons = lessons.length;
    const totalExercises = exercises.length;
    const activeEnrollments = enrollments.filter(e => e.activo !== false).length;

    // Build recent courses (limit to 5, sorted by order)
    const recentCourses = courses
      .sort((a, b) => (a.orden || 0) - (b.orden || 0))
      .slice(0, 5)
      .map(course => ({
        id: course.id,
        titulo: course.titulo,
        nivel: course.nivel,
        profesorId: course.profesorId,
        leccionesCount: course.lecciones?.length || 0,
        profesor: teachers.find(t => t.id === course.profesorId)?.nombre || 'Sin profesor'
      }));

    // Build recent students (limit to 5, sorted by registration date or order)
    const recentStudents = students
      .sort((a, b) => {
        // Sort by fechaRegistro if available, otherwise by id
        if (a.fechaRegistro && b.fechaRegistro) {
          return new Date(a.fechaRegistro) - new Date(b.fechaRegistro);
        }
        return a.id.localeCompare(b.id);
      })
      .slice(0, 5)
      .map(student => ({
        id: student.id,
        nombre: student.nombre,
        email: student.email,
        nivel: student.nivel,
        activo: student.activo !== false
      }));

    return {
      metricas: {
        totalAlumnos: totalStudents,
        alumnosActivos: activeStudents,
        totalCursos: totalCourses,
        totalLecciones: totalLessons,
        totalEjercicios: totalExercises,
        inscripcionesActivas: activeEnrollments
      },
      cursosRecientes: recentCourses,
      alumnosRecientes: recentStudents
    };
  }
}

export default new GetTeacherDashboardData();