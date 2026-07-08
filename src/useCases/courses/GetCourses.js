import CourseRepository from '../../repositories/CourseRepository';

/**
 * Use case: Get all courses
 * Contains business logic for retrieving course list
 */
class GetCourses {
  async execute() {
    return await CourseRepository.getAll();
  }
}

export default new GetCourses();