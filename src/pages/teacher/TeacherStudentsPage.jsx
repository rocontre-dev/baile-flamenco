import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import styles from './TeacherStudentsPage.module.css';

/**
 * Página de lista de alumnos - Placeholder funcional
 * En fases futuras se implementará la lista completa y detalle
 */
const TeacherStudentsPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Users size={32} className={styles.headerIcon} />
          <div>
            <h1>Alumnos</h1>
            <p className={styles.subtitle}>Gestiona los estudiantes de la academia</p>
          </div>
        </div>
      </header>

      <section className={styles.placeholder}>
        <div className={styles.placeholderContent}>
          <Users size={64} className={styles.placeholderIcon} />
          <h2>Lista de Alumnos</h2>
          <p>
            Esta funcionalidad estará disponible próximamente.
            Podrás ver la lista completa de alumnos, sus progresos,
            cursos inscritos y notas de práctica.
          </p>
          <div className={styles.placeholderActions}>
            <Link to="/profesor" className={styles.backLink}>
              <ArrowRight size={18} />
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <h3>Próximamente:</h3>
        <ul className={styles.featuresList}>
          <li>Lista completa de alumnos con filtros y búsqueda</li>
          <li>Detalle de alumno con progreso individual</li>
          <li>Notas de práctica y marcadores personales</li>
          <li>Historial de ejercicios completados</li>
          <li>Asignación de cursos y lecciones</li>
        </ul>
      </section>
    </div>
  );
};

export default TeacherStudentsPage;