import { Link } from 'react-router-dom';
import { Menu, User, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import DemoRoleSwitcher from '../auth/DemoRoleSwitcher';
import { useTranslation } from '../../i18n/i18n';
import styles from './Header.module.css';

/**
 * Main header component
 * Fixed at the top of the page
 */
const Header = () => {
  const { toggleMobileMenu, toggleSidebar } = useApp();
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  
  // Only show Academia link for admin and teacher roles
  const showAcademiaLink = hasRole('admin') || hasRole('teacher');

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left section - Logo and menu toggle */}
        <div className={styles.left}>
          {/* Mobile menu toggle */}
          <button 
            className={styles.menuToggle}
            onClick={toggleMobileMenu}
            aria-label={t('navigation.menu')}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>Tibiritábara</span>
          </Link>
        </div>

        {/* Center section - Navigation */}
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            {t('navigation.home')}
          </Link>
          <Link to="/palos" className={styles.navLink}>
            {t('navigation.palos')}
          </Link>
          <Link to="/biblioteca" className={styles.navLink}>
            {t('navigation.library')}
          </Link>
          <Link to="/progreso" className={styles.navLink}>
            {t('navigation.progress')}
          </Link>
          {showAcademiaLink && (
            <Link to="/academia" className={styles.navLink}>
              Academia
            </Link>
          )}
          <Link to="/profesor" className={`${styles.navLink} ${styles.teacherPanel}`}>
            Panel del profesor
          </Link>
          {!showAcademiaLink && (
            <>
              <Link to="/mis-cursos" className={styles.navLink}>
                Mis Cursos
              </Link>
              {hasRole('student') && (
                <Link to="/mi-perfil" className={styles.navLink}>
                  Mi Perfil
                </Link>
              )}
            </>
          )}
          <Link to="/acerca" className={styles.navLink}>
            {t('navigation.about')}
          </Link>
        </nav>

        {/* Right section - Search, demo role switcher, and account */}
        <div className={styles.right}>
          <button className={styles.iconButton} aria-label={t('common.search')}>
            <Search size={20} />
          </button>
          
          <DemoRoleSwitcher />
          
          <Link to="/cuenta" className={styles.iconButton} aria-label={t('navigation.account')}>
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;