import { Navigate, useParams, useLocation } from 'react-router-dom';

/**
 * LegacyLessonRedirect
 * Redirects old lesson routes to the new student-prefixed routes.
 * Preserves dynamic route parameters, query strings, and URL hash.
 *
 * Example:
 * /palos/tangos/remates/remate-basico
 *   -> /alumno/palos/tangos/remates/remate-basico
 */
const LegacyLessonRedirect = () => {
  const { paloSlug, categoriaSlug, ejercicioSlug } = useParams();
  const location = useLocation();

  // Build the target path segments
  const segments = ['/alumno/palos'];

  if (paloSlug) {
    segments.push(paloSlug);
  }
  if (categoriaSlug) {
    segments.push(categoriaSlug);
  }
  if (ejercicioSlug) {
    segments.push(ejercicioSlug);
  }

  // Build the target path
  let targetPath = segments.join('/');

  // Preserve query string if present
  if (location.search) {
    targetPath += location.search;
  }

  // Preserve hash if present
  if (location.hash) {
    targetPath += location.hash;
  }

  return <Navigate to={targetPath} replace />;
};

export default LegacyLessonRedirect;