import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Main application context
 * Manages global state for the platform
 */
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  // Set loading state
  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };
  
  // Set error
  const setErrorState = (errorMessage) => {
    setError(errorMessage);
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  // Add toast notification
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };
  
  // Remove toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const value = {
    // State
    sidebarOpen,
    mobileMenuOpen,
    loading,
    error,
    toasts,
    
    // Actions
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    setLoading: setLoadingState,
    setError: setErrorState,
    clearError,
    addToast,
    removeToast
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default {
  AppContext,
  AppProvider,
  useApp
};