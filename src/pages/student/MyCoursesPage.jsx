import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Play, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GetCurrentStudentCourses from '../../useCases/students/GetCurrentStudentCourses';
import GetCourseDetail from '../../useCases/courses/GetCourseDetail';
import styles from '../academy/AcademyPages.module.css';

/**
 * My Courses Page (Student)
 * Shows only courses enrolled by the current student
 */
const MyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user) return;
      
      try {
        const studentCourses = await GetCurrentStudentCourses.execute(user.id);
        
        // Get detailed info for each course
        const detailedCourses = await Promise.all(
          studentCourses.map(course => GetCourseDetail.execute(course.id))
        );
        
        setCourses(detailedCourses.filter(Boolean));
      } catch (err) {
        console.error('Error loading student courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando mis cursos...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mis Cursos</h1>
        <p className={styles.pageSubtitle}>
          {courses.length} cursos asignados
        </p>
      </div>

      {courses.length > 0 ? (
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
              
              {/* Teacher info */}
              {course.teacher && (
                <p className={styles.courseTeacher}>
                  <strong>Profesor:</strong> {course.teacher.name}
                </p>
              )}
              
              <div className={styles.courseMeta}>
                <span className={styles.courseMetaItem}>
                  <Clock size={14} />
                  {course.duration}
                </span>
                <span className={styles.courseMetaItem}>
                  <Users size={14} />
                  {course.enrolledStudents?.length || 0} compañeros
                </span>
                <span className={styles.courseMetaItem}>
                  <BookOpen size={14} />
                  {course.lessons.length} lecciones
                </span>
              </div>
              
              <div className={styles.courseActions}>
                <Link 
                  to={`/academia/cursos/${course.id}`} 
                  className={styles.viewDetailLink}
                >
                  Ver curso <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No tienes cursos asignados actualmente.</p>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;