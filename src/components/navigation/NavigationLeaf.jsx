import { NavLink, useLocation } from 'react-router-dom';
import { Folder } from 'lucide-react';
import styles from './NavigationLeaf.module.css';

/**
 * NavigationLeaf component
 * Represents a leaf node (Category) in the navigation tree
 */
const NavigationLeaf = ({ leaf, isActive }) => {
  const { id, name, path } = leaf;

  return (
    <li className={styles.leafItem} role="treeitem">
      <NavLink
        to={path}
        className={({ isActive: linkActive }) =>
          `${styles.leafLink} ${linkActive || isActive ? styles.active : ''}`
        }
        role="treeitem"
        aria-current={isActive ? 'page' : undefined}
      >
        <Folder size={14} className={styles.leafIcon} />
        <span className={styles.leafName}>{name}</span>
      </NavLink>
    </li>
  );
};

export default NavigationLeaf;