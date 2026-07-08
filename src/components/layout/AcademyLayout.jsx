import { NavLink, Outlet } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AcademyLayout.module.css';

/**
 * Academy Layout
 * Provides navigation sidebar for Academy section
 * Navigation items vary based on user role
 */
const AcademyLayout = () => {
  const { hasRole } = useAuth();
  
  // Admin navigation items
  const adminNavItems = [
    { path: '/academia/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/academia/alumnos', icon: Users, label: 'Alumnos' },
    { path: '/academia/profesores', icon: GraduationCap, label: 'Profesores' },
    { path: '/academia/cursos', icon: BookOpen, label: 'Cursos' },
  ];
  
  // Teacher navigation items
  const teacherNavItems = [
    { path: '/academia/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/academia/mis-cursos', icon: BookOpen, label: 'Mis Cursos' },
    { path: '/academia/mis-alumnos', icon: Users, label: 'Mis Alumnos' },
  ];
  
  // Determine which nav items to show based on role
  const navItems = hasRole('admin') ? adminNavItems : teacherNavItems;

  return (
    <div className={styles.academyLayout}>
      {/* Academy Sidebar */}
      <aside className={styles.academySidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Academia</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
              end={item.path === '/academia/dashboard'}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.academyContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AcademyLayout;