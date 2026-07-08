import { mockCourses } from '../../data/mockCourses';

/**
 * Use case: Get courses taught by current teacher
 */
class GetTeacherCourses {
  async execute(teacherId) {
    return mockCourses.filter(course => course.teacherId === teacherId);
  }
}

export default new GetTeacherCourses();