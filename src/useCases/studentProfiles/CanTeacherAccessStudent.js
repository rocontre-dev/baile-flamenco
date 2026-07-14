import CourseRepository from '../../repositories/CourseRepository';
import StudentProfileRepository from '../../repositories/StudentProfileRepository';

/**
 * Use case: Check if a teacher can access a student's profile
 * A teacher can access a student if the student is enrolled in a course taught by the teacher
 */
class CanTeacherAccessStudent {
  /**
   * Execute the authorization check
   * @param {string} teacherId - The teacher's ID (from auth context)
   * @param {string} studentId - The student's ID to check access for
   * @returns {Promise<boolean>} True if teacher can access the student
   */
  async execute(teacherId, studentId) {
    if (!teacherId || !studentId) {
      return false;
    }

    try {
      // Get all courses taught by this teacher
      const allCourses = await CourseRepository.getAll();
      const teacherCourses = allCourses.filter(course => course.profesorId === teacherId);

      if (teacherCourses.length === 0) {
        return false;
      }

      // Get the student's enrolled courses
      const studentProfile = await StudentProfileRepository.getByStudentId(studentId);

      if (!studentProfile || !studentProfile.coursesEnrolled) {
        return false;
      }

      // Check if student is enrolled in any of the teacher's courses
      const teacherCourseIds = teacherCourses.map(course => course.id);
      const isEnrolledInTeacherCourse = studentProfile.coursesEnrolled.some(
        courseId => teacherCourseIds.includes(courseId)
      );

      return isEnrolledInTeacherCourse;

    } catch (error) {
      console.error('CanTeacherAccessStudent error:', error);
      return false;
    }
  }
}

export default new CanTeacherAccessStudent();