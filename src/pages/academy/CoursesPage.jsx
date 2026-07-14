import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GetCourses from '../../useCases/courses/GetCourses';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import styles from './AcademyPages.module.css';

/**
 * Courses Page
 * Lists all courses with details
 */
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const data = await GetCourses.execute();
        // Ensure data is array
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('Courses data is not an array:', data);
          setCourses([]);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <p>No fue posible cargar los cursos. Por favor, intenta de nuevo.</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={styles.loading}>
        <p>No hay cursos disponibles.</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Cursos</h1>
        <p className={styles.pageSubtitle}>
          {courses.length} cursos disponibles
        </p>
      </div>

      <div className={styles.coursesGrid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <div className={styles.courseHeader}>
              <h3 className={styles.courseName}>{course.titulo}</h3>
              <span className={`${styles.courseLevel} ${styles[`level${course.nivel}`]}`}>
                {course.nivel}
              </span>
            </div>
            <p className={styles.courseDescription}>{course.descripcion}</p>
            <div className={styles.courseMeta}>
              <span className={styles.courseMetaItem}>
                <Clock size={14} />
                {course.duracion}
              </span>
              <span className={styles.courseMetaItem}>
                <BookOpen size={14} />
                {course.lecciones?.length || 0} lecciones
              </span>
            </div>
            <Link to={`/administrador/academia/cursos/${course.id}`} className={styles.viewDetailLink}>
              Ver detalle <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;