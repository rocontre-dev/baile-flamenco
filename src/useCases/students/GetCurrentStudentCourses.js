import { mockStudents } from '../../data/mockStudents';
import { mockCourses } from '../../data/mockCourses';

/**
 * Use case: Get courses enrolled by current student
 */
class GetCurrentStudentCourses {
  async execute(studentId) {
    // Get student
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return [];
    
    // Get courses the student is enrolled in
    return mockCourses.filter(course =>
      student.assignedCourseIds.includes(course.id)
    );
  }
}

export default new GetCurrentStudentCourses();