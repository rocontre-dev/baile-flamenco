import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';
import styles from './Layout.module.css';

/**
 * Main layout component
 * Wraps all pages with header, sidebar, and content area
 */
const Layout = () => {
  const { sidebarOpen, mobileMenuOpen, closeMobileMenu } = useApp();

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  return (
    <div className={styles.layout}>
      {/* Fixed header */}
      <Header />

      {/* Fixed sidebar - hidden on mobile unless open */}
      <div className={`${styles.sidebarWrapper} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu} />
      )}

      {/* Main content */}
      <main
        className={`${styles.content} ${sidebarOpen ? styles.withSidebar : ''}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;