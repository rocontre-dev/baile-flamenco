import { mockStudents } from '../../data/mockStudents';
import { mockTeachers } from '../../data/mockTeachers';
import { mockCourses } from '../../data/mockCourses';

/**
 * Use case: Get Academy Dashboard Data
 * Aggregates data from students, teachers, and courses for dashboard display
 */
class GetAcademyDashboardData {
  async execute() {
    // Total counts
    const totalStudents = mockStudents.length;
    const totalTeachers = mockTeachers.length;
    const totalCourses = mockCourses.length;
    const totalLessons = mockCourses.reduce((sum, course) => sum + course.lessons.length, 0);

    // Students by level
    const studentsByLevel = {
      Principiante: mockStudents.filter(s => s.level === 'Principiante').length,
      Intermedio: mockStudents.filter(s => s.level === 'Intermedio').length,
      Avanzado: mockStudents.filter(s => s.level === 'Avanzado').length
    };

    // Courses by level
    const coursesByLevel = {
      Principiante: mockCourses.filter(c => c.level === 'Principiante').length,
      Intermedio: mockCourses.filter(c => c.level === 'Intermedio').length,
      Avanzado: mockCourses.filter(c => c.level === 'Avanzado').length
    };

    // Most popular courses (by number of students enrolled)
    const popularCourses = mockCourses
      .map(course => {
        const studentCount = mockStudents.filter(student =>
          student.assignedCourseIds.includes(course.id)
        ).length;
        return {
          ...course,
          enrolledStudents: studentCount
        };
      })
      .sort((a, b) => b.enrolledStudents - a.enrolledStudents);

    // Teachers with academic load
    const teachersWithLoad = mockTeachers.map(teacher => ({
      ...teacher,
      courseCount: teacher.assignedCourseIds.length
    })).sort((a, b) => b.courseCount - a.courseCount);

    return {
      totals: {
        students: totalStudents,
        teachers: totalTeachers,
        courses: totalCourses,
        lessons: totalLessons
      },
      studentsByLevel,
      coursesByLevel,
      popularCourses,
      teachersWithLoad
    };
  }
}

export default new GetAcademyDashboardData();