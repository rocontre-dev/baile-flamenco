import { Routes, Route, Navigate } from 'react-router-dom';
import AcademyLayout from '../components/layout/AcademyLayout';
import RoleGuard from '../components/auth/RoleGuard';
import AppLayout from '../components/layout/AppLayout';
import LegacyLessonRedirect from '../components/routes/LegacyLessonRedirect';
import ProfileSelectionPage from '../pages/ProfileSelectionPage';
import PalosPage from '../pages/PalosPage';
import PaloDetailPage from '../pages/PaloDetailPage';
import CategoryPage from '../pages/CategoryPage';
import LessonPage from '../pages/LessonPage';
import BibliotecaPage from '../pages/BibliotecaPage';
import ProgresoPage from '../pages/ProgresoPage';
import CuentaPage from '../pages/CuentaPage';
import NotFoundPage from '../pages/NotFoundPage';
import AcademyDashboard from '../pages/academy/AcademyDashboard';
import StudentsPage from '../pages/academy/StudentsPage';
import TeachersPage from '../pages/academy/TeachersPage';
import CoursesPage from '../pages/academy/CoursesPage';
import CourseDetailPage from '../pages/academy/CourseDetailPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import MyCoursesPageStudent from '../pages/student/MyCoursesPage';
import MyProfilePage from '../pages/student/MyProfilePage';
import MyCoursesPageTeacher from '../pages/teacher/MyCoursesPage';
import MyStudentsPage from '../pages/teacher/MyStudentsPage';
import StudentProfilePage from '../pages/academy/StudentProfilePage';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';
import TeacherStudentsPage from '../pages/teacher/TeacherStudentsPage';
import TeacherCoursesPage from '../pages/teacher/TeacherCoursesPage';
import TeacherContentPage from '../pages/teacher/TeacherContentPage';
import { ROLES } from '../config/roles';

/**
 * Main application routes
 * Defines all routes with their corresponding pages
 * Reorganized for role-based navigation
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Profile Selection Page - Root */}
      <Route path="/" element={<ProfileSelectionPage />} />
      
      {/* Admin Area */}
      <Route path="/administrador" element={
        <RoleGuard allowedRoles={[ROLES.ADMIN]}>
          <AppLayout />
        </RoleGuard>
      }>
        <Route index element={<AcademyDashboard />} />
        {/* Academy sub-section uses AcademyLayout for its sidebar */}
        <Route path="academia" element={<AcademyLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AcademyDashboard />} />
          <Route path="profesores" element={<TeachersPage />} />
          <Route path="alumnos" element={<StudentsPage />} />
          <Route path="cursos" element={<CoursesPage />} />
          <Route path="cursos/:courseId" element={<CourseDetailPage />} />
        </Route>
        {/* Direct admin routes (no AcademyLayout sidebar) */}
        <Route path="profesores" element={<TeachersPage />} />
        <Route path="alumnos" element={<StudentsPage />} />
        <Route path="cursos" element={<CoursesPage />} />
        <Route path="cursos/:courseId" element={<CourseDetailPage />} />
        <Route path="configuracion" element={<AdminSettingsPage />} />
      </Route>
      
      {/* Teacher Area */}
      <Route path="/profesor" element={
        <RoleGuard allowedRoles={[ROLES.TEACHER]}>
          <AppLayout />
        </RoleGuard>
      }>
        <Route index element={<TeacherDashboardPage />} />
        <Route path="cursos" element={<TeacherCoursesPage />} />
        <Route path="alumnos" element={<TeacherStudentsPage />} />
        <Route path="planes-practica" element={<TeacherContentPage />} />
        <Route path="contenido" element={<TeacherContentPage />} />
      </Route>
      
      {/* Student Area */}
      <Route path="/alumno" element={
        <RoleGuard allowedRoles={[ROLES.STUDENT]}>
          <AppLayout />
        </RoleGuard>
      }>
        {/* Student area index redirects to cursos */}
        <Route index element={<Navigate to="cursos" replace />} />
        <Route path="cursos" element={<MyCoursesPageStudent />} />
        <Route path="palos" element={<PalosPage />} />
        <Route path="palos/:paloSlug" element={<PaloDetailPage />} />
        <Route path="palos/:paloSlug/:categoriaSlug" element={<CategoryPage />} />
        <Route path="palos/:paloSlug/:categoriaSlug/:ejercicioSlug" element={<LessonPage />} />
        <Route path="biblioteca" element={<BibliotecaPage />} />
        <Route path="progreso" element={<ProgresoPage />} />
        <Route path="practica" element={<LessonPage />} />
        <Route path="cuenta" element={<CuentaPage />} />
        <Route path="mi-perfil" element={<MyProfilePage />} />
      </Route>
      
      {/* Legacy Routes - Redirect to student area */}
      <Route path="/palos" element={<Navigate to="/alumno/palos" replace />} />
      {/* Legacy lesson routes use dynamic redirect component to preserve parameters */}
      <Route path="/palos/:paloSlug" element={<LegacyLessonRedirect />} />
      <Route path="/palos/:paloSlug/:categoriaSlug" element={<LegacyLessonRedirect />} />
      <Route path="/palos/:paloSlug/:categoriaSlug/:ejercicioSlug" element={<LegacyLessonRedirect />} />
      <Route path="/biblioteca" element={<Navigate to="/alumno/biblioteca" replace />} />
      <Route path="/progreso" element={<Navigate to="/alumno/progreso" replace />} />
      <Route path="/cuenta" element={<Navigate to="/alumno/cuenta" replace />} />
      
      {/* Legacy Academy Routes (backward compatibility) */}
      <Route path="/academia" element={
        <RoleGuard allowedRoles={['admin', ROLES.ADMIN]}>
          <AcademyLayout />
        </RoleGuard>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AcademyDashboard />} />
        <Route path="alumnos" element={<StudentsPage />} />
        <Route path="profesores" element={<TeachersPage />} />
        <Route path="cursos" element={<CoursesPage />} />
        <Route path="cursos/:courseId" element={<CourseDetailPage />} />
      </Route>
      
      {/* Legacy Teacher Routes (backward compatibility) */}
      <Route path="/academia/mis-cursos" element={
        <RoleGuard allowedRoles={['admin', 'teacher', ROLES.ADMIN, ROLES.TEACHER]}>
          <AcademyLayout />
        </RoleGuard>
      }>
        <Route index element={<MyCoursesPageTeacher />} />
      </Route>
      <Route path="/academia/mis-alumnos" element={
        <RoleGuard allowedRoles={['admin', 'teacher', ROLES.ADMIN, ROLES.TEACHER]}>
          <AcademyLayout />
        </RoleGuard>
      }>
        <Route index element={<MyStudentsPage />} />
      </Route>
      
      {/* Student Profile - accessible only by teacher (not admin) */}
      <Route path="/academia/alumnos/:studentId" element={
        <RoleGuard allowedRoles={['teacher', ROLES.TEACHER]}>
          <AcademyLayout />
        </RoleGuard>
      }>
        <Route index element={<StudentProfilePage />} />
      </Route>
      
      {/* Legacy Student Routes (backward compatibility) */}
      <Route path="/mis-cursos" element={
        <RoleGuard allowedRoles={['admin', 'teacher', 'student', ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
          <MyCoursesPageStudent />
        </RoleGuard>
      } />
      <Route path="/mi-perfil" element={
        <RoleGuard allowedRoles={['student', ROLES.STUDENT]}>
          <MyProfilePage />
        </RoleGuard>
      } />
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;