import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import styles from './TeacherLayout.module.css';

/**
 * Layout principal para el área del profesor
 * Proporciona sidebar de navegación y área de contenido
 */
const TeacherLayout = () => {
  return (
    <div className={styles.layout}>
      <TeacherSidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;