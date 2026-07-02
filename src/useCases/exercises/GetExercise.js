import ExerciseRepository from '../../repositories/ExerciseRepository';
import TeacherRepository from '../../repositories/TeacherRepository';
import LessonRepository from '../../repositories/LessonRepository';
import CategoryRepository from '../../repositories/CategoryRepository';
import PaloRepository from '../../repositories/PaloRepository';

/**
 * Use case: Get a single exercise with all related data
 * Contains business logic for retrieving a complete exercise
 */
class GetExercise {
  async execute(identifier, bySlug = true) {
    // Get exercise
    const exercise = bySlug 
      ? await ExerciseRepository.getBySlug(identifier)
      : await ExerciseRepository.getById(identifier);
    
    if (!exercise) {
      throw new Error('Ejercicio no encontrado');
    }
    
    // Get related data
    const profesor = await TeacherRepository.getById(exercise.profesorId);
    const lesson = await LessonRepository.getById(exercise.leccionId);
    const categoria = await CategoryRepository.getById(lesson?.categoriaId);
    const palo = await PaloRepository.getById(categoria?.paloId);
    
    // Return enriched exercise
    return {
      ...exercise,
      profesor,
      lesson,
      categoria,
      palo
    };
  }
}

export default new GetExercise();