import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, FileText, ArrowLeft } from 'lucide-react';
import styles from './TeacherSidebar.module.css';

/**
 * Sidebar de navegación para el área del profesor
 */
const TeacherSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>Tibirítábara</h1>
        <span>Panel del Profesor</span>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/profesor"
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              end
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profesor/alumnos"
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <Users size={20} />
              <span>Alumnos</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profesor/cursos"
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <BookOpen size={20} />
              <span>Cursos</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profesor/contenido"
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''} ${styles.disabled}`
              }
            >
              <FileText size={20} />
              <span>Contenido</span>
              <span className={styles.comingSoon}>Próximamente</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className={styles.footer}>
        <NavLink to="/" className={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Volver al sitio</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default TeacherSidebar;