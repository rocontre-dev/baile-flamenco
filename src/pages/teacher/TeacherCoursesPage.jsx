import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import styles from './TeacherCoursesPage.module.css';

/**
 * Página de lista de cursos - Placeholder funcional
 * En fases futuras se implementará la lista completa y gestión
 */
const TeacherCoursesPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <BookOpen size={32} className={styles.headerIcon} />
          <div>
            <h1>Cursos</h1>
            <p className={styles.subtitle}>Gestiona los cursos y contenido de la academia</p>
          </div>
        </div>
      </header>

      <section className={styles.placeholder}>
        <div className={styles.placeholderContent}>
          <BookOpen size={64} className={styles.placeholderIcon} />
          <h2>Gestión de Cursos</h2>
          <p>
            Esta funcionalidad estará disponible próximamente.
            Podrás ver todos los cursos, sus lecciones, ejercicios
            asignados y el progreso general de los alumnos.
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
          <li>Lista completa de cursos con filtros por nivel y palo</li>
          <li>Detalle de curso con lecciones y ejercicios</li>
          <li>Asignación de contenido a alumnos</li>
          <li>Estadísticas de progreso por curso</li>
          <li>Creación y edición de cursos y lecciones</li>
        </ul>
      </section>
    </div>
  );
};

export default TeacherCoursesPage;