import { createContext, useContext, useState, useEffect } from 'react';
import { mockCurrentUser } from '../data/mockCurrentUser';

/**
 * Authentication context
 * Manages user authentication and role-based access control
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role permissions definition
const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'alumnos', 'profesores', 'cursos', 'mis-cursos', 'mis-alumnos', 'detalle-curso'],
  teacher: ['dashboard', 'mis-cursos', 'mis-alumnos', 'detalle-curso'],
  student: ['mis-cursos', 'detalle-curso']
};

export const AuthProvider = ({ children }) => {
  // User state - using mockCurrentUser for development
  const [user, setUser] = useState(mockCurrentUser);
  
  // Loading state
  const [loading, setLoading] = useState(false); // No loading needed for mock
  
  // Check if user can access a specific permission
  const canAccess = (permissions = []) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all permissions
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.some(perm => userPermissions.includes(perm));
  };
  
  // Login function (mock)
  const login = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, return the mock user
      setUser(mockCurrentUser);
      return { success: true, user: mockCurrentUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function (mock)
  const logout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUser(mockCurrentUser); // Return to mock user
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };
  
  // Switch user role (for development/testing)
  const switchRole = (newRole) => {
    const mockUsers = {
      admin: { id: 'admin-1', role: 'admin', name: 'Administrador' },
      teacher: { id: 'teacher-1', role: 'teacher', name: 'Carmen Morales' },
      student: { id: 'student-1', role: 'student', name: 'María López' }
    };
    
    if (mockUsers[newRole]) {
      setUser(mockUsers[newRole]);
    }
  };
  
  const value = {
    // State
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    
    // Actions
    login,
    logout,
    hasRole,
    canAccess,
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