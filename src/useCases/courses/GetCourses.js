import CourseRepository from '../../repositories/CourseRepository';

/**
 * Use case: Get all courses
 * Contains business logic for retrieving courses
 */
class GetCourses {
  async execute(filters = {}) {
    let courses = await CourseRepository.getActive();
    
    // Apply filters
    if (filters.level) {
      courses = courses.filter(course => course.nivel === filters.level);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      courses = courses.filter(course => 
        course.titulo.toLowerCase().includes(searchLower) ||
        course.descripcion.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by order
    courses.sort((a, b) => a.orden - b.orden);
    
    return courses;
  }
}

export default new GetCourses();