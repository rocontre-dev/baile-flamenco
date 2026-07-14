import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/roles';

/**
 * RoleGuard Component
 * Protects routes based on user roles
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles that can access this route
 * @param {ReactNode} props.children - Content to render if access is granted
 * @param {ReactNode} props.element - Alternative: element to render if access is granted (for route elements)
 */
const RoleGuard = ({ allowedRoles = [], children, element }) => {
  const { currentUser, isAuthenticated } = useAuth();

  // If not authenticated, redirect to home (profile selection)
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Normalize roles for comparison (handle both old and new formats)
  const normalizeRole = (role) => {
    const roleMap = {
      admin: ROLES.ADMIN,
      teacher: ROLES.TEACHER,
      student: ROLES.STUDENT,
    };
    return roleMap[role] || role;
  };

  // Check if user has one of the allowed roles
  const hasAllowedRole = allowedRoles.some(allowedRole => {
    const normalizedAllowed = normalizeRole(allowedRole);
    const normalizedCurrent = normalizeRole(currentUser.role);
    return normalizedAllowed === normalizedCurrent;
  });

  if (!hasAllowedRole) {
    return <Navigate to="/" replace />;
  }

  // Render children or element
  return children || element;
};

export default RoleGuard;