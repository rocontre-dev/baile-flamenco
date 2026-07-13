import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, FileText, Target, ArrowRight, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GetAcademyDashboardData from '../../useCases/academy/GetAcademyDashboardData';
import GetTeacherDashboardData from '../../useCases/teachers/GetTeacherDashboardData';
import styles from './AcademyPages.module.css';

// Priority badge colors
const priorityColors = {
  'Alta': { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' },
  'Media': { bg: 'rgba(251, 191, 36, 0.15)', color: '#ca8a04' },
  'Baja': { bg: 'rgba(34, 197, 94, 0.15)', color: '#16a34a' }
};

// Format date to "DD Mon YYYY" format in Spanish
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Academy Dashboard
 * Shows different views based on user role:
 * - Admin: General academy statistics
 * - Teacher: Personal dashboard with their courses and students
 */
const AcademyDashboard = () => {
  const { user, hasRole } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (hasRole('teacher') && user?.id) {
          const data = await GetTeacherDashboardData.execute(user.id);
          setTeacherData(data);
        } else if (hasRole('admin')) {
          const data = await GetAcademyDashboardData.execute();
          setAdminData(data);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, hasRole]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // Teacher Dashboard
  if (hasRole('teacher') && teacherData) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard del Profesor</h1>
          <p className={styles.pageSubtitle}>
            Resumen de tus cursos y alumnos
          </p>
        </div>

        {/* Summary Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{teacherData.summary.courses}</span>
              <span className={styles.statLabel}>Mis Cursos</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{teacherData.summary.students}</span>
              <span className={styles.statLabel}>Mis Alumnos</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileText size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{teacherData.summary.lessons}</span>
              <span className={styles.statLabel}>Lecciones Asignadas</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Target size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{teacherData.summary.activePlans}</span>
              <span className={styles.statLabel}>Objetivos Activos</span>
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        {teacherData.recentCourses.length > 0 && (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Mis Cursos Recientes</h2>
            <div className={styles.popularList}>
              {teacherData.recentCourses.map((course) => (
                <div key={course.id} className={styles.popularItem}>
                  <div className={styles.popularInfo}>
                    <span className={styles.popularName}>{course.name}</span>
                    <span className={`${styles.popularLevel} ${styles[`level${course.level}`]}`}>
                      {course.level}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <span className={styles.popularCount}>
                      {course.studentCount} alumno{course.studentCount !== 1 ? 's' : ''}
                    </span>
                    <Link
                      to={`/academia/cursos/${course.id}`}
                      className={styles.viewDetailLink}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                    >
                      Ver curso <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Students */}
        {teacherData.students.length > 0 && (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Mis Alumnos</h2>
            <div className={styles.enrolledList}>
              {teacherData.students.map((student) => (
                <div key={student.id} className={styles.enrolledItem}>
                  <div className={styles.enrolledInfo}>
                    <span className={styles.enrolledName}>{student.name}</span>
                    <span className={`${styles.enrolledLevel} ${styles[`level${student.level}`]}`}>
                      {student.level}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <span className={styles.enrolledEmail}>
                      {student.sharedCourses} curso{student.sharedCourses !== 1 ? 's' : ''} compartido{student.sharedCourses !== 1 ? 's' : ''}
                    </span>
                    <Link
                      to={`/academia/alumnos/${student.id}`}
                      className={styles.practiceButton}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                    >
                      <Eye size={12} />
                      Ver perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Practice Plans */}
        {teacherData.activePlans.length > 0 && (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Planes de Práctica Activos</h2>
            <div className={styles.lessonsList}>
              {teacherData.activePlans.map((plan) => (
                <div key={plan.id} className={styles.lessonItem}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--color-text)' }}>{plan.title}</span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: priorityColors[plan.priority]?.bg,
                        color: priorityColors[plan.priority]?.color
                      }}>
                        {plan.priority}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      <span>
                        <strong>Alumno:</strong> {plan.studentName}
                      </span>
                      <span>
                        <strong>Fecha límite:</strong> {formatDate(plan.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin Dashboard (existing)
  if (hasRole('admin') && adminData) {
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
              <span className={styles.statValue}>{adminData.totals.students}</span>
              <span className={styles.statLabel}>Alumnos</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <GraduationCap size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{adminData.totals.teachers}</span>
              <span className={styles.statLabel}>Profesores</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{adminData.totals.courses}</span>
              <span className={styles.statLabel}>Cursos</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileText size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{adminData.totals.lessons}</span>
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
                <span className={styles.levelCount}>{adminData.studentsByLevel.Principiante}</span>
              </div>
              <div className={styles.levelItem}>
                <span className={`${styles.levelBadge} ${styles.levelIntermedio}`}>
                  Intermedio
                </span>
                <span className={styles.levelCount}>{adminData.studentsByLevel.Intermedio}</span>
              </div>
              <div className={styles.levelItem}>
                <span className={`${styles.levelBadge} ${styles.levelAvanzado}`}>
                  Avanzado
                </span>
                <span className={styles.levelCount}>{adminData.studentsByLevel.Avanzado}</span>
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
                <span className={styles.levelCount}>{adminData.coursesByLevel.Principiante}</span>
              </div>
              <div className={styles.levelItem}>
                <span className={`${styles.levelBadge} ${styles.levelIntermedio}`}>
                  Intermedio
                </span>
                <span className={styles.levelCount}>{adminData.coursesByLevel.Intermedio}</span>
              </div>
              <div className={styles.levelItem}>
                <span className={`${styles.levelBadge} ${styles.levelAvanzado}`}>
                  Avanzado
                </span>
                <span className={styles.levelCount}>{adminData.coursesByLevel.Avanzado}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Cursos Más Populares</h2>
          <div className={styles.popularList}>
            {adminData.popularCourses.map((course) => (
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
            {adminData.teachersWithLoad.map((teacher) => (
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
  }

  return (
    <div className={styles.loading}>
      <p>Cargando dashboard...</p>
    </div>
  );
};

export default AcademyDashboard;