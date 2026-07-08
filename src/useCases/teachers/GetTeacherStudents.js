import { mockStudents } from '../../data/mockStudents';
import { mockCourses } from '../../data/mockCourses';

/**
 * Use case: Get students enrolled in courses taught by current teacher
 */
class GetTeacherStudents {
  async execute(teacherId) {
    // Get courses taught by this teacher
    const teacherCourses = mockCourses.filter(course => course.teacherId === teacherId);
    const teacherCourseIds = teacherCourses.map(c => c.id);
    
    // Get students enrolled in those courses
    return mockStudents.filter(student =>
      student.assignedCourseIds.some(courseId => teacherCourseIds.includes(courseId))
    );
  }
}

export default new GetTeacherStudents();