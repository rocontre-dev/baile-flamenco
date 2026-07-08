import StudentRepository from '../../repositories/StudentRepository';

/**
 * Use case: Get all students
 * Contains business logic for retrieving student list
 */
class GetStudents {
  async execute() {
    return await StudentRepository.getAll();
  }
}

export default new GetStudents();