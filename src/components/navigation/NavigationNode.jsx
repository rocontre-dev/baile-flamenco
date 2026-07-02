import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';
import NavigationLeaf from './NavigationLeaf';
import styles from './NavigationNode.module.css';

/**
 * NavigationNode component
 * Represents a tree node (Palo) that can be expanded/collapsed
 */
const NavigationNode = ({ node, isExpanded, onToggle }) => {
  const location = useLocation();
  const { id, name, path, children, disabled } = node;

  // Check if this node's path is active
  const isActive = location.pathname === path;

  // Check if any child is active
  const hasActiveChild = children?.some(child =>
    location.pathname.startsWith(child.path)
  );

  // Handle click on the node header
  const handleClick = (e) => {
    e.preventDefault();
    onToggle();
  };

  // If disabled, render as a non-interactive element
  if (disabled) {
    return (
      <li className={styles.node} role="treeitem" aria-expanded={false}>
        <div className={`${styles.nodeHeader} ${styles.disabled}`}>
          <div className={styles.nodeHeaderLeft}>
            <Folder size={16} className={styles.nodeIcon} />
            <span className={styles.nodeName}>{name}</span>
          </div>
          <span className={styles.comingSoon}>Próximamente</span>
        </div>
      </li>
    );
  }

  return (
    <li className={styles.node} role="treeitem" aria-expanded={isExpanded}>
      {/* Node Header - Clickable area for toggle */}
      <div
        className={`${styles.nodeHeader} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className={styles.nodeHeaderLeft}>
          <ChevronRight
            size={16}
            className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
          />
          <Folder size={16} className={styles.nodeIcon} />
          <span className={styles.nodeName}>{name}</span>
        </div>
      </div>

      {/* Children - Categories list */}
      {children && children.length > 0 && (
        <ul
          className={`${styles.childrenList} ${isExpanded ? styles.childrenExpanded : ''}`}
          role="group"
        >
          {children.map(child => (
            <NavigationLeaf
              key={child.id}
              leaf={child}
              isActive={hasActiveChild && location.pathname.startsWith(child.path)}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavigationNode;