import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Clock, User, Play } from 'lucide-react';
import GetCourseDetail from '../../useCases/courses/GetCourseDetail';
import styles from './AcademyPages.module.css';

/**
 * Course Detail Page
 * Shows full course information including teacher, lessons, and enrolled students
 */
const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseDetail = async () => {
      try {
        const data = await GetCourseDetail.execute(courseId);
        setCourse(data);
      } catch (err) {
        console.error('Error loading course detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetail();
  }, [courseId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.comingSoon}>
          <h2>Curso no encontrado</h2>
          <p>No se pudo encontrar el curso con ID: {courseId}</p>
          <Link to="/academia/cursos" className={styles.backLink}>
            ← Volver a Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <Link to="/academia/cursos" className={styles.backLink}>
          ← Volver a Cursos
        </Link>
        <h1 className={styles.pageTitle}>{course.name}</h1>
        <div className={styles.courseMetaHeader}>
          <span className={`${styles.levelBadge} ${styles[`level${course.level}`]}`}>
            {course.level}
          </span>
          <span className={styles.paloTag}>{course.palo}</span>
        </div>
        <p className={styles.courseDescriptionFull}>{course.description}</p>
        <div className={styles.courseMetaInfo}>
          <span><Clock size={14} /> {course.duration}</span>
          <span><BookOpen size={14} /> {course.lessons.length} lecciones</span>
          <span><Users size={14} /> {course.enrolledStudents.length} alumnos</span>
        </div>
      </div>

      {/* Teacher Section */}
      {course.teacher && (
        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>Profesor</h2>
          <div className={styles.teacherDetailCard}>
            <div className={styles.teacherDetailAvatar}>
              <User size={32} />
            </div>
            <div className={styles.teacherDetailInfo}>
              <h3 className={styles.teacherDetailName}>{course.teacher.name}</h3>
              <p className={styles.teacherDetailSpecialty}>{course.teacher.specialty}</p>
              <p className={styles.teacherDetailEmail}>{course.teacher.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lessons Section */}
      <div className={styles.detailSection}>
        <h2 className={styles.sectionTitle}>Lecciones del Curso</h2>
        {course.lessons.length > 0 ? (
          <div className={styles.lessonsList}>
            {course.lessons.map((lessonId, index) => (
              <div key={index} className={styles.lessonItem}>
                <div className={styles.lessonInfo}>
                  <span className={styles.lessonNumber}>Lección {index + 1}</span>
                  <span className={styles.lessonId}>{lessonId}</span>
                </div>
                <Link
                  to={`/palos/${course.palo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/${lessonId.split('-')[0]}/${lessonId}`}
                  className={styles.practiceButton}
                >
                  <Play size={14} />
                  Practicar
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            Este curso aún no tiene lecciones asignadas.
          </div>
        )}
      </div>

      {/* Enrolled Students Section */}
      <div className={styles.detailSection}>
        <h2 className={styles.sectionTitle}>Alumnos Inscritos</h2>
        {course.enrolledStudents.length > 0 ? (
          <div className={styles.enrolledList}>
            {course.enrolledStudents.map((student) => (
              <div key={student.id} className={styles.enrolledItem}>
                <div className={styles.enrolledInfo}>
                  <span className={styles.enrolledName}>{student.name}</span>
                  <span className={`${styles.enrolledLevel} ${styles[`level${student.level}`]}`}>
                    {student.level}
                  </span>
                </div>
                <span className={styles.enrolledEmail}>{student.email}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            Este curso aún no tiene alumnos inscritos.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;