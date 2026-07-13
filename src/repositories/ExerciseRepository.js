import { fetchData } from '../utils/helpers';

/**
 * Repository for exercise data access
 * Responsible only for fetching data, no business logic
 */
class ExerciseRepository {
  constructor() {
    this.endpoint = 'ejercicios.json';
    this.cache = null;
  }

  /**
   * Fetch all exercises
   * @returns {Promise<Array>} List of all exercises
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('ExerciseRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get an exercise by ID
   * @param {string} id - Exercise ID
   * @returns {Promise<Object|null>} Exercise object or null if not found
   */
  async getById(id) {
    const exercises = await this.getAll();
    return exercises.find(ex => ex.id === id) || null;
  }

  /**
   * Get an exercise by slug
   * @param {string} slug - Exercise slug
   * @returns {Promise<Object|null>} Exercise object or null if not found
   */
  async getBySlug(slug) {
    const exercises = await this.getAll();
    return exercises.find(ex => ex.slug === slug) || null;
  }

  /**
   * Get exercises by lesson ID
   * @param {string} leccionId - Lesson ID
   * @returns {Promise<Array>} List of exercises for the lesson
   */
  async getByLesson(leccionId) {
    const exercises = await this.getAll();
    return exercises
      .filter(ex => ex.leccionId === leccionId)
      .sort((a, b) => a.orden - b.orden);
  }

  /**
   * Get exercises by category ID
   * @param {string} categoriaId - Category ID
   * @returns {Promise<Array>} List of exercises for the category
   * @deprecated Use getByTipo() instead. Category-based filtering is transitional.
   */
  async getByCategoria(categoriaId) {
    const exercises = await this.getAll();
    return exercises.filter(ex => ex.categoriaId === categoriaId);
  }

  /**
   * Get exercises by type (remate, marcaje, llamada, etc.)
   * @param {string} tipo - Exercise type
   * @returns {Promise<Array>} List of exercises matching the type
   */
  async getByTipo(tipo) {
    const exercises = await this.getAll();
    return exercises.filter(ex => ex.tipo === tipo);
  }

  /**
   * Get exercises by palo ID
   * @param {string} paloId - Palo ID
   * @returns {Promise<Array>} List of exercises for the palo
   */
  async getByPalo(paloId) {
    const exercises = await this.getAll();
    return exercises.filter(ex => ex.paloId === paloId);
  }

  /**
   * Get exercises by level
   * @param {string} level - Exercise level
   * @returns {Promise<Array>} List of exercises matching the level
   */
  async getByLevel(level) {
    const exercises = await this.getAll();
    return exercises.filter(ex => ex.nivel === level);
  }

  /**
   * Search exercises by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} List of matching exercises
   */
  async search(query) {
    const exercises = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return exercises.filter(ex => 
      ex.titulo.toLowerCase().includes(lowerQuery) ||
      ex.descripcion.toLowerCase().includes(lowerQuery) ||
      ex.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get active exercises only
   * @returns {Promise<Array>} List of active exercises
   */
  async getActive() {
    const exercises = await this.getAll();
    return exercises.filter(ex => ex.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new ExerciseRepository();