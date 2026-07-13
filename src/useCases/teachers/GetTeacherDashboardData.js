import { mockCourses } from '../../data/mockCourses';
import { mockStudents } from '../../data/mockStudents';
import { mockPracticePlans } from '../../data/mockPracticePlans';

/**
 * Use case: Get dashboard data for teacher
 * Returns only information related to the teacher's courses and students
 */
class GetTeacherDashboardData {
  async execute(teacherId) {
    // Get courses taught by this teacher
    const teacherCourses = mockCourses.filter(course => course.teacherId === teacherId);
    const teacherCourseIds = teacherCourses.map(c => c.id);

    // Get students enrolled in teacher's courses
    const teacherStudents = mockStudents.filter(student =>
      student.assignedCourseIds.some(courseId => teacherCourseIds.includes(courseId))
    );

    // Calculate total lessons in teacher's courses
    const totalLessons = teacherCourses.reduce((sum, course) => sum + course.lessons.length, 0);

    // Get active practice plans (Pendiente or En Progreso) for teacher's students
    const activePlans = mockPracticePlans.filter(plan =>
      plan.studentId && teacherStudents.some(s => s.id === plan.studentId) &&
      plan.status !== 'Completado'
    );

    // Build recent courses (sorted by student count)
    const recentCourses = teacherCourses.map(course => ({
      id: course.id,
      name: course.name,
      level: course.level,
      palo: course.palo,
      studentCount: course.studentCount
    })).sort((a, b) => b.studentCount - a.studentCount);

    // Build students list
    const students = teacherStudents.map(student => ({
      id: student.id,
      name: student.name,
      level: student.level,
      email: student.email,
      sharedCourses: student.assignedCourseIds.filter(id => teacherCourseIds.includes(id)).length
    }));

    // Build active plans list
    const activePlansList = activePlans.map(plan => ({
      id: plan.id,
      studentName: mockStudents.find(s => s.id === plan.studentId)?.name || 'Desconocido',
      title: plan.title,
      priority: plan.priority,
      dueDate: plan.dueDate,
      status: plan.status
    })).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return {
      summary: {
        courses: teacherCourses.length,
        students: teacherStudents.length,
        lessons: totalLessons,
        activePlans: activePlans.length
      },
      recentCourses,
      students,
      activePlans: activePlansList
    };
  }
}

export default new GetTeacherDashboardData();