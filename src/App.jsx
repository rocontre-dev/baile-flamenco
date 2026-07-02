import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './i18n/i18n';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';

/**
 * Main Application Component
 * Tibiritábara - Plataforma de Aprendizaje de Baile Flamenco
 */
function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AppProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AppProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;