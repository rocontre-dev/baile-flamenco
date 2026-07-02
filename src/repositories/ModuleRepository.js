import { fetchData } from '../utils/helpers';

/**
 * Repository for module data access
 * Responsible only for fetching data, no business logic
 */
class ModuleRepository {
  constructor() {
    this.endpoint = 'modulos.json';
    this.cache = null;
  }

  /**
   * Fetch all modules
   * @returns {Promise<Array>} List of all modules
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('ModuleRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a module by ID
   * @param {string} id - Module ID
   * @returns {Promise<Object|null>} Module object or null if not found
   */
  async getById(id) {
    const modules = await this.getAll();
    return modules.find(module => module.id === id) || null;
  }

  /**
   * Get modules by course ID
   * @param {string} cursoId - Course ID
   * @returns {Promise<Array>} List of modules for the course
   */
  async getByCourse(cursoId) {
    const modules = await this.getAll();
    return modules.filter(module => module.cursoId === cursoId);
  }

  /**
   * Get active modules only
   * @returns {Promise<Array>} List of active modules
   */
  async getActive() {
    const modules = await this.getAll();
    return modules.filter(module => module.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new ModuleRepository();