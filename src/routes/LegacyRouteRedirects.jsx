import { Navigate, useParams, useLocation } from 'react-router-dom';

/**
 * Componente para redirigir rutas antiguas a nuevas rutas por rol
 * Conserva correctamente los parámetros dinámicos y query strings
 */
const LegacyRouteRedirects = () => {
  const { paloSlug, categoriaSlug, ejercicioSlug } = useParams();
  const location = useLocation();

  // Build the base path
  const segments = ['/alumno/palos'];
  
  if (paloSlug) segments.push(paloSlug);
  if (categoriaSlug) segments.push(categoriaSlug);
  if (ejercicioSlug) segments.push(ejercicioSlug);

  // Build the target path
  let targetPath = segments.join('/');

  // Preserve query string and hash if present
  if (location.search) {
    targetPath += location.search;
  }
  if (location.hash) {
    targetPath += location.hash;
  }

  return <Navigate to={targetPath} replace />;
};

export default LegacyRouteRedirects;