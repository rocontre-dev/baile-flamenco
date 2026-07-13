import { mockStudents } from '../../data/mockStudents';
import { mockCourses } from '../../data/mockCourses';
import { mockTeachers } from '../../data/mockTeachers';

/**
 * Use case: Get student profile with enriched data
 * Returns student data with courses, teachers, and statistics
 */
class GetStudentProfile {
  async execute(studentId) {
    // Find the student
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) {
      return null;
    }

    // Get assigned courses
    const assignedCourses = mockCourses.filter(course =>
      student.assignedCourseIds.includes(course.id)
    );

    // Get teachers for those courses
    const teacherIds = [...new Set(assignedCourses.map(course => course.teacherId))];
    const teachers = mockTeachers.filter(teacher => teacherIds.includes(teacher.id));

    // Calculate total lessons
    const totalLessons = assignedCourses.reduce((sum, course) => sum + course.lessons.length, 0);

    // Build enriched student profile
    return {
      ...student,
      assignedCourses: assignedCourses.map(course => ({
        ...course,
        teacher: teachers.find(t => t.id === course.teacherId) || null
      })),
      teachers: teachers.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        specialty: teacher.specialty,
        email: teacher.email
      })),
      totalCourses: assignedCourses.length,
      totalLessons: totalLessons
    };
  }
}

export default new GetStudentProfile();