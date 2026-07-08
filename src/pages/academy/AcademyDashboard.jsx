import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, FileText } from 'lucide-react';
import GetAcademyDashboardData from '../../useCases/academy/GetAcademyDashboardData';
import styles from './AcademyPages.module.css';

/**
 * Academy Dashboard
 * Main dashboard showing academy statistics and summaries
 */
const AcademyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardData = await GetAcademyDashboardData.execute();
        setData(dashboardData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.comingSoon}>
        <p>Error al cargar datos del dashboard</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard de Academia</h1>
        <p className={styles.pageSubtitle}>
          Resumen general de la academia de flamenco
        </p>
      </div>

      {/* Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data.totals.students}</span>
            <span className={styles.statLabel}>Alumnos</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <GraduationCap size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data.totals.teachers}</span>
            <span className={styles.statLabel}>Profesores</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data.totals.courses}</span>
            <span className={styles.statLabel}>Cursos</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{data.totals.lessons}</span>
            <span className={styles.statLabel}>Lecciones</span>
          </div>
        </div>
      </div>

      {/* Level Summaries */}
      <div className={styles.dashboardSections}>
        {/* Students by Level */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Alumnos por Nivel</h2>
          <div className={styles.levelSummary}>
            <div className={styles.levelItem}>
              <span className={`${styles.levelBadge} ${styles.levelPrincipiante}`}>
                Principiante
              </span>
              <span className={styles.levelCount}>{data.studentsByLevel.Principiante}</span>
            </div>
            <div className={styles.levelItem}>
              <span className={`${styles.levelBadge} ${styles.levelIntermedio}`}>
                Intermedio
              </span>
              <span className={styles.levelCount}>{data.studentsByLevel.Intermedio}</span>
            </div>
            <div className={styles.levelItem}>
              <span className={`${styles.levelBadge} ${styles.levelAvanzado}`}>
                Avanzado
              </span>
              <span className={styles.levelCount}>{data.studentsByLevel.Avanzado}</span>
            </div>
          </div>
        </div>

        {/* Courses by Level */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Cursos por Nivel</h2>
          <div className={styles.levelSummary}>
            <div className={styles.levelItem}>
              <span className={`${styles.levelBadge} ${styles.levelPrincipiante}`}>
                Principiante
              </span>
              <span className={styles.levelCount}>{data.coursesByLevel.Principiante}</span>
            </div>
            <div className={styles.levelItem}>
              <span className={`${styles.levelBadge} ${styles.levelIntermedio}`}>
                Intermedio
              </span>
              <span className={styles.levelCount}>{data.coursesByLevel.Intermedio}</span>
            </div>
            <div className={styles.levelItem}>
              <span className={`${styles.levelBadge} ${styles.levelAvanzado}`}>
                Avanzado
              </span>
              <span className={styles.levelCount}>{data.coursesByLevel.Avanzado}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Cursos Más Populares</h2>
        <div className={styles.popularList}>
          {data.popularCourses.map((course) => (
            <div key={course.id} className={styles.popularItem}>
              <div className={styles.popularInfo}>
                <span className={styles.popularName}>{course.name}</span>
                <span className={`${styles.popularLevel} ${styles[`level${course.level}`]}`}>
                  {course.level}
                </span>
              </div>
              <span className={styles.popularCount}>
                {course.enrolledStudents} alumno{course.enrolledStudents !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Teachers with Academic Load */}
      <div className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Profesores y Carga Académica</h2>
        <div className={styles.teachersList}>
          {data.teachersWithLoad.map((teacher) => (
            <div key={teacher.id} className={styles.teacherItem}>
              <div className={styles.teacherInfo}>
                <span className={styles.teacherName}>{teacher.name}</span>
                <span className={styles.teacherSpecialty}>{teacher.specialty}</span>
              </div>
              <span className={styles.teacherLoad}>
                {teacher.courseCount} curso{teacher.courseCount !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;