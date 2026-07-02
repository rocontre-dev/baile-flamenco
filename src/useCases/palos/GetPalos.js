import PaloRepository from '../../repositories/PaloRepository';
import CategoryRepository from '../../repositories/CategoryRepository';

/**
 * Use case: Get all palos with their categories
 * Contains business logic for retrieving palos
 */
class GetPalos {
  async execute(includeCategories = false) {
    const palos = await PaloRepository.getActive();
    
    // Sort by order
    palos.sort((a, b) => a.orden - b.orden);
    
    if (includeCategories) {
      // Enrich each palo with its categories
      const enrichedPalos = await Promise.all(
        palos.map(async (palo) => {
          const categorias = await CategoryRepository.getByPalo(palo.id);
          return {
            ...palo,
            categorias
          };
        })
      );
      return enrichedPalos;
    }
    
    return palos;
  }
}

export default new GetPalos();