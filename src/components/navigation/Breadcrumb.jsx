import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumb.module.css';

/**
 * Breadcrumb navigation component
 * Shows the path to the current page
 */
const Breadcrumb = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {/* Home link */}
        <li className={styles.item}>
          <Link to="/" className={styles.link}>
            <Home size={16} />
            <span>Inicio</span>
          </Link>
        </li>

        {/* Intermediate items */}
        {items.slice(0, -1).map((item, index) => (
          <li key={index} className={styles.item}>
            <ChevronRight size={14} className={styles.separator} />
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          </li>
        ))}

        {/* Current page (last item) */}
        {items.length > 0 && (
          <li className={`${styles.item} ${styles.current}`}>
            <ChevronRight size={14} className={styles.separator} />
            <span className={styles.currentPage} aria-current="page">
              {items[items.length - 1].label}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;