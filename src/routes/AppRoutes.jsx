import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import PalosPage from '../pages/PalosPage';
import PaloDetailPage from '../pages/PaloDetailPage';
import CategoryPage from '../pages/CategoryPage';
import LessonPage from '../pages/LessonPage';
import BibliotecaPage from '../pages/BibliotecaPage';
import ProgresoPage from '../pages/ProgresoPage';
import AcercaPage from '../pages/AcercaPage';
import CuentaPage from '../pages/CuentaPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Main application routes
 * Defines all routes with their corresponding pages
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Wrap all routes in Layout */}
      <Route path="/" element={<Layout />}>
        {/* Home - redirect to first lesson */}
        <Route index element={<Navigate to="/palos/tangos/remates/remate-basico" replace />} />
        
        {/* Palos listing */}
        <Route path="palos" element={<PalosPage />} />
        
        {/* Palo detail (e.g., /palos/tangos) */}
        <Route path="palos/:paloSlug" element={<PaloDetailPage />} />
        
        {/* Category detail (e.g., /palos/tangos/remates) */}
        <Route path="palos/:paloSlug/:categoriaSlug" element={<CategoryPage />} />
        
        {/* Lesson/Exercise detail (e.g., /palos/tangos/remates/remate-basico) */}
        <Route path="palos/:paloSlug/:categoriaSlug/:ejercicioSlug" element={<LessonPage />} />
        
        {/* Other pages */}
        <Route path="biblioteca" element={<BibliotecaPage />} />
        <Route path="progreso" element={<ProgresoPage />} />
        <Route path="acerca" element={<AcercaPage />} />
        <Route path="cuenta" element={<CuentaPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
        
        {/* Redirect old paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;