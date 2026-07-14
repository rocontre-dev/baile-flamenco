import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, MOCK_USERS, STORAGE_KEY } from '../config/roles';

/**
 * Authentication context
 * Manages user authentication and role-based access control
 * Updated for role-based navigation system
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Carga el usuario almacenado en localStorage de forma segura
 * Maneja datos corruptos o antiguos
 */
const loadStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    const parsedUser = JSON.parse(storedUser);

    // Validate that the role is valid
    if (!parsedUser?.role || !Object.values(ROLES).includes(parsedUser.role)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsedUser;
  } catch {
    // If there's any error parsing, clear the storage
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // User state - check localStorage first
  const [currentUser, setCurrentUser] = useState(() => loadStoredUser());

  // Loading state
  const [loading, setLoading] = useState(false);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // Check if user can access a specific permission
  const canAccess = (permissions = []) => {
    if (!currentUser) return false;
    // Admin has all permissions
    if (currentUser.role === ROLES.ADMIN) return true;
    
    // For backward compatibility, also check string roles
    if (currentUser.role === 'admin') return true;
    
    return false;
  };

  // Login function (mock) - kept for backward compatibility
  const login = async (_email, _password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, return the current user or a default student
      const user = currentUser || MOCK_USERS[ROLES.STUDENT];
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role (case-insensitive for backward compatibility)
  const hasRole = (role) => {
    if (!currentUser) return false;
    // Normalize both roles to uppercase for comparison
    const normalizedUserRole = currentUser.role?.toUpperCase();
    const normalizedRole = role?.toUpperCase();
    return normalizedUserRole === normalizedRole;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  // Select role (for profile selection page)
  const selectRole = (role) => {
    if (MOCK_USERS[role]) {
      setCurrentUser(MOCK_USERS[role]);
    }
  };

  // Switch role (for backward compatibility with DemoRoleSwitcher)
  const switchRole = (newRole) => {
    // Map old role names to new constants
    const roleMap = {
      admin: ROLES.ADMIN,
      teacher: ROLES.TEACHER,
      student: ROLES.STUDENT,
    };
    
    const normalizedRole = roleMap[newRole] || newRole;
    
    if (MOCK_USERS[normalizedRole]) {
      setCurrentUser(MOCK_USERS[normalizedRole]);
    }
  };

  const value = {
    // State
    currentUser,
    // Backward compatibility: also export as 'user' for existing components
    user: currentUser,
    currentRole: currentUser?.role,
    loading,
    isAuthenticated: isAuthenticated(),

    // Actions
    login,
    logout,
    hasRole,
    canAccess,
    selectRole,
    switchRole,
    checkAuth: () => setLoading(true)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default {
  AuthContext,
  AuthProvider,
  useAuth
};