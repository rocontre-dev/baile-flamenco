import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

/**
 * Layout común para las áreas de administrador, profesor y alumno
 * Proporciona sidebar de navegación configurable y área de contenido
 */
const AppLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;