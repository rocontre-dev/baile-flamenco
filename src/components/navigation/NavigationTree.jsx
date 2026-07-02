import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationNode from './NavigationNode';
import styles from './NavigationTree.module.css';

/**
 * NavigationTree component
 * Main container for the sidebar navigation tree
 * Manages expansion state for all nodes
 */
const NavigationTree = ({ nodes }) => {
  const location = useLocation();

  // Initialize expansion state from URL or defaults
  const initialExpandedState = useMemo(() => {
    const state = {};
    nodes.forEach(node => {
      // Check if current path is within this node's children
      const hasActiveChild = node.children?.some(child =>
        location.pathname.startsWith(child.path)
      );
      // Tangos (first node) is expanded by default, or if has active child
      state[node.id] = node.isDefaultExpanded || hasActiveChild;
    });
    return state;
  }, [nodes, location.pathname]);

  const [expandedNodes, setExpandedNodes] = useState(initialExpandedState);

  // Toggle node expansion
  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  return (
    <nav className={styles.tree} role="navigation" aria-label="Main navigation">
      <ul className={styles.treeList}>
        {nodes.map(node => (
          <NavigationNode
            key={node.id}
            node={node}
            isExpanded={expandedNodes[node.id] || false}
            onToggle={() => toggleNode(node.id)}
          />
        ))}
      </ul>
    </nav>
  );
};

export default NavigationTree;