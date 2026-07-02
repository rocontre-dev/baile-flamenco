import { fetchData } from '../utils/helpers';

/**
 * Repository for lesson data access
 * Responsible only for fetching data, no business logic
 */
class LessonRepository {
  constructor() {
    this.endpoint = 'lecciones.json';
    this.cache = null;
  }

  /**
   * Fetch all lessons
   * @returns {Promise<Array>} List of all lessons
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('LessonRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a lesson by ID
   * @param {string} id - Lesson ID
   * @returns {Promise<Object|null>} Lesson object or null if not found
   */
  async getById(id) {
    const lessons = await this.getAll();
    return lessons.find(lesson => lesson.id === id) || null;
  }

  /**
   * Get a lesson by slug
   * @param {string} slug - Lesson slug
   * @returns {Promise<Object|null>} Lesson object or null if not found
   */
  async getBySlug(slug) {
    const lessons = await this.getAll();
    return lessons.find(lesson => lesson.slug === slug) || null;
  }

  /**
   * Get lessons by category ID
   * @param {string} categoriaId - Category ID
   * @returns {Promise<Array>} List of lessons for the category
   */
  async getByCategory(categoriaId) {
    const lessons = await this.getAll();
    return lessons
      .filter(lesson => lesson.categoriaId === categoriaId)
      .sort((a, b) => a.orden - b.orden);
  }

  /**
   * Get active lessons only
   * @returns {Promise<Array>} List of active lessons
   */
  async getActive() {
    const lessons = await this.getAll();
    return lessons.filter(lesson => lesson.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new LessonRepository();