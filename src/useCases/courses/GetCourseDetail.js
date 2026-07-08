import CourseRepository from '../../repositories/CourseRepository';
import TeacherRepository from '../../repositories/TeacherRepository';
import StudentRepository from '../../repositories/StudentRepository';

/**
 * Use case: Get course detail with enriched data
 * Returns course with teacher, lessons, and enrolled students
 */
class GetCourseDetail {
  async execute(courseId) {
    // Get course
    const course = await CourseRepository.getById(courseId);
    if (!course) {
      return null;
    }

    // Get teacher
    const teacher = await TeacherRepository.getById(course.teacherId);

    // Get enrolled students
    const allStudents = await StudentRepository.getAll();
    const enrolledStudents = allStudents.filter(student =>
      student.assignedCourseIds.includes(course.id)
    );

    // Return enriched course
    return {
      ...course,
      teacher,
      enrolledStudents
    };
  }
}

export default new GetCourseDetail();