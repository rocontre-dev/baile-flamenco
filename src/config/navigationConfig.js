/**
 * Configuración de navegación por rol
 * Define los menús disponibles para cada perfil de usuario
 */

import { ROLES } from './roles';
import { PERMISSIONS, ROLE_PERMISSIONS } from './permissions';

/**
 * Configuración de navegación para cada rol
 * Cada elemento debe tener:
 * - path: ruta de navegación
 * - label: etiqueta visible
 * - icon: nombre del icono de lucide-react
 * - permission: permiso requerido (opcional)
 * - end: si es ruta final para active state (opcional)
 */
export const navigationConfig = {
  [ROLES.ADMIN]: [
    {
      path: '/administrador',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      permission: PERMISSIONS.VIEW_ADMIN_DASHBOARD,
      end: true,
    },
    {
      path: '/administrador/profesores',
      label: 'Profesores',
      icon: 'GraduationCap',
      permission: PERMISSIONS.MANAGE_TEACHERS,
    },
    {
      path: '/administrador/alumnos',
      label: 'Alumnos',
      icon: 'Users',
      permission: PERMISSIONS.MANAGE_STUDENTS,
    },
    {
      path: '/administrador/cursos',
      label: 'Cursos',
      icon: 'BookOpen',
      permission: PERMISSIONS.MANAGE_COURSES,
    },
    {
      path: '/administrador/academia',
      label: 'Academia',
      icon: 'GraduationCap',
      permission: PERMISSIONS.VIEW_ACADEMY,
    },
    {
      path: '/administrador/configuracion',
      label: 'Configuración',
      icon: 'Settings',
      permission: PERMISSIONS.VIEW_SETTINGS,
    },
  ],

  [ROLES.TEACHER]: [
    {
      path: '/profesor',
      label: 'Mi Dashboard',
      icon: 'LayoutDashboard',
      permission: PERMISSIONS.VIEW_TEACHER_DASHBOARD,
      end: true,
    },
    {
      path: '/profesor/cursos',
      label: 'Mis Cursos',
      icon: 'BookOpen',
      permission: PERMISSIONS.VIEW_ASSIGNED_COURSES,
    },
    {
      path: '/profesor/alumnos',
      label: 'Mis Alumnos',
      icon: 'Users',
      permission: PERMISSIONS.VIEW_ASSIGNED_STUDENTS,
    },
    {
      path: '/profesor/planes-practica',
      label: 'Planes de práctica',
      icon: 'FileText',
      permission: PERMISSIONS.MANAGE_PRACTICE_PLANS,
    },
  ],

  [ROLES.STUDENT]: [
    {
      path: '/alumno/cursos',
      label: 'Mis Cursos',
      icon: 'BookOpen',
      permission: PERMISSIONS.VIEW_STUDENT_COURSES,
      end: true,
    },
    {
      path: '/alumno/palos',
      label: 'Lecciones',
      icon: 'Play',
      permission: PERMISSIONS.VIEW_LESSONS,
    },
    {
      path: '/alumno/practica',
      label: 'Practice Player',
      icon: 'Video',
      permission: PERMISSIONS.USE_PRACTICE_PLAYER,
    },
    {
      path: '/alumno/progreso',
      label: 'Mi Progreso',
      icon: 'TrendingUp',
      permission: PERMISSIONS.VIEW_OWN_PROGRESS,
    },
  ],
};

/**
 * Obtiene los elementos de navegación para un rol específico
 * @param {string} role - El rol del usuario
 * @returns {Array} Lista de elementos de navegación autorizados
 */
export function getNavigationItems(role) {
  const items = navigationConfig[role] || [];
  return items.filter(item => {
    if (!item.permission) return true;
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(item.permission);
  });
}
