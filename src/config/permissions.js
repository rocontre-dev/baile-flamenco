/**
 * Permisos y autorización
 * Sistema de permisos para la aplicación Tibiritábara
 */

import { ROLES } from './roles';

/**
 * Lista de permisos disponibles
 */
export const PERMISSIONS = {
  // Permisos de Administrador
  VIEW_ADMIN_DASHBOARD: 'VIEW_ADMIN_DASHBOARD',
  MANAGE_TEACHERS: 'MANAGE_TEACHERS',
  MANAGE_STUDENTS: 'MANAGE_STUDENTS',
  MANAGE_COURSES: 'MANAGE_COURSES',
  VIEW_ACADEMY: 'VIEW_ACADEMY',
  VIEW_SETTINGS: 'VIEW_SETTINGS',

  // Permisos de Profesor
  VIEW_TEACHER_DASHBOARD: 'VIEW_TEACHER_DASHBOARD',
  VIEW_ASSIGNED_COURSES: 'VIEW_ASSIGNED_COURSES',
  VIEW_ASSIGNED_STUDENTS: 'VIEW_ASSIGNED_STUDENTS',
  MANAGE_PRACTICE_PLANS: 'MANAGE_PRACTICE_PLANS',

  // Permisos de Alumno
  VIEW_STUDENT_COURSES: 'VIEW_STUDENT_COURSES',
  VIEW_LESSONS: 'VIEW_LESSONS',
  USE_PRACTICE_PLAYER: 'USE_PRACTICE_PLAYER',
  VIEW_OWN_PROGRESS: 'VIEW_OWN_PROGRESS',
};

/**
 * Mapeo de roles a permisos
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    PERMISSIONS.MANAGE_TEACHERS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.VIEW_ACADEMY,
    PERMISSIONS.VIEW_SETTINGS,
  ],

  [ROLES.TEACHER]: [
    PERMISSIONS.VIEW_TEACHER_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_COURSES,
    PERMISSIONS.VIEW_ASSIGNED_STUDENTS,
    PERMISSIONS.MANAGE_PRACTICE_PLANS,
  ],

  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_STUDENT_COURSES,
    PERMISSIONS.VIEW_LESSONS,
    PERMISSIONS.USE_PRACTICE_PLAYER,
    PERMISSIONS.VIEW_OWN_PROGRESS,
  ],
};

/**
 * Verifica si un rol tiene un permiso específico
 * @param {string} role - El rol del usuario
 * @param {string} permission - El permiso a verificar
 * @returns {boolean} True si el rol tiene el permiso
 */
export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Verifica si un rol tiene alguno de los permisos especificados
 * @param {string} role - El rol del usuario
 * @param {Array<string>} permissions - Lista de permisos a verificar
 * @returns {boolean} True si el rol tiene al menos uno de los permisos
 */
export function hasAnyPermission(role, permissions) {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Verifica si un rol tiene todos los permisos especificados
 * @param {string} role - El rol del usuario
 * @param {Array<string>} permissions - Lista de permisos requeridos
 * @returns {boolean} True si el rol tiene todos los permisos
 */
export function hasAllPermissions(role, permissions) {
  return permissions.every(permission => hasPermission(role, permission));
}