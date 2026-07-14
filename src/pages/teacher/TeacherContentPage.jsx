import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import styles from './TeacherContentPage.module.css';

/**
 * Página de gestión de contenido - Placeholder funcional
 * En fases futuras se implementará la gestión completa de contenido
 */
const TeacherContentPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <FileText size={32} className={styles.headerIcon} />
          <div>
            <h1>Contenido</h1>
            <p className={styles.subtitle}>Gestiona ejercicios, lecciones y recursos didácticos</p>
          </div>
        </div>
      </header>

      <section className={styles.placeholder}>
        <div className={styles.placeholderContent}>
          <FileText size={64} className={styles.placeholderIcon} />
          <h2>Gestión de Contenido</h2>
          <p>
            Esta funcionalidad estará disponible próximamente.
            Podrás administrar ejercicios, lecciones, videos,
            imágenes y otros recursos didácticos de la plataforma.
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
          <li>Lista completa de ejercicios con filtros y búsqueda</li>
          <li>Gestión de videos y recursos multimedia</li>
          <li>Editor de lecciones y pasos</li>
          <li>Asignación de contenido a cursos</li>
          <li>Estadísticas de uso de ejercicios</li>
        </ul>
      </section>
    </div>
  );
};

export default TeacherContentPage;