import { fetchData } from '../utils/helpers';

/**
 * Repository for teacher data access
 * Responsible only for fetching data, no business logic
 */
class TeacherRepository {
  constructor() {
    this.endpoint = 'profesores.json';
    this.cache = null;
  }

  /**
   * Fetch all teachers
   * @returns {Promise<Array>} List of all teachers
   */
  async getAll() {
    if (this.cache) return this.cache;
    
    try {
      const data = await fetchData(this.endpoint);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('TeacherRepository.getAll error:', error);
      throw error;
    }
  }

  /**
   * Get a teacher by ID
   * @param {string} id - Teacher ID
   * @returns {Promise<Object|null>} Teacher object or null if not found
   */
  async getById(id) {
    const teachers = await this.getAll();
    return teachers.find(teacher => teacher.id === id) || null;
  }

  /**
   * Get a teacher by slug
   * @param {string} slug - Teacher slug
   * @returns {Promise<Object|null>} Teacher object or null if not found
   */
  async getBySlug(slug) {
    const teachers = await this.getAll();
    return teachers.find(teacher => teacher.slug === slug) || null;
  }

  /**
   * Get teachers by specialty
   * @param {string} specialty - Palo specialty
   * @returns {Promise<Array>} List of teachers with the specialty
   */
  async getBySpecialty(specialty) {
    const teachers = await this.getAll();
    return teachers.filter(teacher => 
      teacher.especialidades.some(esp => 
        esp.toLowerCase() === specialty.toLowerCase()
      )
    );
  }

  /**
   * Get active teachers only
   * @returns {Promise<Array>} List of active teachers
   */
  async getActive() {
    const teachers = await this.getAll();
    return teachers.filter(teacher => teacher.activo !== false);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new TeacherRepository();