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
    
    // Get palo - prefer direct paloId, fallback to category-based lookup for compatibility
    // TODO: Remove category-based lookup once all exercises have paloId
    let palo = null;
    if (exercise.paloId) {
      palo = await PaloRepository.getById(exercise.paloId);
    } else if (lesson?.categoriaId) {
      const categoria = await CategoryRepository.getById(lesson.categoriaId);
      palo = await PaloRepository.getById(categoria?.paloId);
    }
    
    // Get categoria for backward compatibility (transitional)
    // TODO: Remove once category-based routing is deprecated
    let categoria = null;
    if (lesson?.categoriaId) {
      categoria = await CategoryRepository.getById(lesson.categoriaId);
    } else if (exercise.categoriaId) {
      categoria = await CategoryRepository.getById(exercise.categoriaId);
    }
    
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