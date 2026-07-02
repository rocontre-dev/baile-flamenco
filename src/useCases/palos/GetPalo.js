import PaloRepository from '../../repositories/PaloRepository';
import CategoryRepository from '../../repositories/CategoryRepository';
import ExerciseRepository from '../../repositories/ExerciseRepository';

/**
 * Use case: Get a single palo with all related data
 * Contains business logic for retrieving a complete palo
 */
class GetPalo {
  async execute(identifier, bySlug = true) {
    // Get palo
    const palo = bySlug 
      ? await PaloRepository.getBySlug(identifier)
      : await PaloRepository.getById(identifier);
    
    if (!palo) {
      throw new Error('Palo no encontrado');
    }
    
    // Get categories for this palo
    const categorias = await CategoryRepository.getByPalo(palo.id);
    
    // Get exercises count for each category
    const categoriasWithExercises = await Promise.all(
      categorias.map(async (categoria) => {
        const ejercicios = await ExerciseRepository.getByCategoria(categoria.id);
        return {
          ...categoria,
          ejerciciosCount: ejercicios.length
        };
      })
    );
    
    // Return enriched palo
    return {
      ...palo,
      categorias: categoriasWithExercises
    };
  }
}

export default new GetPalo();