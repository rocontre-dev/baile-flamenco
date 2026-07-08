import TeacherRepository from '../../repositories/TeacherRepository';

/**
 * Use case: Get all teachers
 * Contains business logic for retrieving teacher list
 */
class GetTeachers {
  async execute() {
    return await TeacherRepository.getAll();
  }
}

export default new GetTeachers();