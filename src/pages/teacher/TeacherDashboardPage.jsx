import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import GetTeacherDashboardData from '../../useCases/teachers/GetTeacherDashboardData';
import styles from './TeacherDashboardPage.module.css';

/**
 * Dashboard principal del profesor
 * Muestra métricas generales y datos recientes
 */
const TeacherDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await GetTeacherDashboardData.execute();
        setData(dashboardData);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Clock size={48} className={styles.loadingIcon} />
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error || 'No se pudieron cargar los datos'}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { metricas, cursosRecientes, alumnosRecientes } = data;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p className={styles.subtitle}>Resumen general de la academia</p>
      </header>

      {/* Métricas */}
      <section className={styles.metricsSection}>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Users size={24} />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{metricas?.totalAlumnos || 0}</span>
              <span className={styles.metricLabel}>Total Alumnos</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{metricas?.alumnosActivos || 0}</span>
              <span className={styles.metricLabel}>Alumnos Activos</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{metricas?.totalCursos || 0}</span>
              <span className={styles.metricLabel}>Total Cursos</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <FileText size={24} />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{metricas?.totalLecciones || 0}</span>
              <span className={styles.metricLabel}>Total Lecciones</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{metricas?.totalEjercicios || 0}</span>
              <span className={styles.metricLabel}>Total Ejercicios</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{metricas?.inscripcionesActivas || 0}</span>
              <span className={styles.metricLabel}>Inscripciones Activas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos recientes */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Cursos Recientes</h2>
          <Link to="/profesor/cursos" className={styles.viewAllLink}>
            Ver todos
          </Link>
        </div>

        {cursosRecientes && cursosRecientes.length > 0 ? (
          <div className={styles.coursesGrid}>
            {cursosRecientes.map(curso => (
              <div key={curso.id} className={styles.courseCard}>
                <h3 className={styles.courseTitle}>{curso.titulo}</h3>
                <div className={styles.courseMeta}>
                  <span className={`${styles.badge} ${styles.badgeLevel}`}>
                    {curso.nivel}
                  </span>
                  <span className={styles.courseProfesor}>
                    👤 {curso.profesor}
                  </span>
                </div>
                <div className={styles.courseLessons}>
                  {curso.leccionesCount} lecciones
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No hay cursos disponibles</p>
          </div>
        )}
      </section>

      {/* Alumnos recientes */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Alumnos Recientes</h2>
          <Link to="/profesor/alumnos" className={styles.viewAllLink}>
            Ver todos
          </Link>
        </div>

        {alumnosRecientes && alumnosRecientes.length > 0 ? (
          <div className={styles.studentsTable}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Nivel</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alumnosRecientes.map(alumno => (
                  <tr key={alumno.id}>
                    <td className={styles.studentName}>{alumno.nombre}</td>
                    <td className={styles.studentEmail}>{alumno.email}</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeLevel}`}>
                        {alumno.nivel}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${alumno.activo ? styles.statusActive : styles.statusInactive}`}>
                        {alumno.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No hay alumnos registrados</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboardPage;