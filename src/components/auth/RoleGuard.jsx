import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import styles from './RoleGuard.module.css';

/**
 * RoleGuard Component
 * Protects routes based on user roles
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles that can access this route
 * @param {ReactNode} props.children - Content to render if access is granted
 */
const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, canAccess } = useAuth();

  // Check if user has permission
  const hasPermission = canAccess(allowedRoles);

  if (!hasPermission) {
    return (
      <div className={styles.container}>
        <div className={styles.icon}>
          <AlertTriangle size={48} />
        </div>
        <h1 className={styles.title}>Acceso Restringido</h1>
        <p className={styles.message}>
          No tienes permisos para acceder a esta sección.
        </p>
        <p className={styles.hint}>
          Rol actual: <strong>{user?.role || 'No autenticado'}</strong>
        </p>
        <Link to="/" className={styles.backButton}>
          Volver
        </Link>
      </div>
    );
  }

  return children;
};

export default RoleGuard;