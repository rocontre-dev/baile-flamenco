import { useState, useEffect } from 'react';
import GetCourses from '../../useCases/courses/GetCourses';
import { BookOpen, Clock, Users } from 'lucide-react';
import styles from './AcademyPages.module.css';

/**
 * Courses Page
 * Lists all courses with details
 */
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await GetCourses.execute();
        setCourses(data);
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando cursos...</p>
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
              <h3 className={styles.courseName}>{course.name}</h3>
              <span className={`${styles.courseLevel} ${styles[`level${course.level}`]}`}>
                {course.level}
              </span>
            </div>
            <p className={styles.coursePalo}>{course.palo}</p>
            <p className={styles.courseDescription}>{course.description}</p>
            <div className={styles.courseMeta}>
              <span className={styles.courseMetaItem}>
                <Clock size={14} />
                {course.duration}
              </span>
              <span className={styles.courseMetaItem}>
                <Users size={14} />
                {course.studentCount} alumnos
              </span>
              <span className={styles.courseMetaItem}>
                <BookOpen size={14} />
                {course.lessons.length} lecciones
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;