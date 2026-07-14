/**
 * Roles y constantes de autorización
 * Sistema de roles para la aplicación Tibiritábara
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.TEACHER]: 'Profesor',
  [ROLES.STUDENT]: 'Alumno',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Gestiona toda la academia',
  [ROLES.TEACHER]: 'Administra cursos y alumnos',
  [ROLES.STUDENT]: 'Accede a tus clases y práctica',
};

export const ROLE_ICONS = {
  [ROLES.ADMIN]: 'GraduationCap',
  [ROLES.TEACHER]: 'Users',
  [ROLES.STUDENT]: 'BookOpen',
};

/**
 * Usuarios mock para demostración
 * Se utilizan al seleccionar un perfil en la pantalla inicial
 */
export const MOCK_USERS = {
  [ROLES.ADMIN]: {
    id: 'admin-demo',
    name: 'Administrador',
    role: ROLES.ADMIN,
  },
  [ROLES.TEACHER]: {
    id: 'teacher-demo',
    name: 'Profesor Demo',
    role: ROLES.TEACHER,
  },
  [ROLES.STUDENT]: {
    id: 'student-demo',
    name: 'Alumno Demo',
    role: ROLES.STUDENT,
  },
};

/**
 * Clave para persistir el usuario en localStorage
 */
export const STORAGE_KEY = 'tibiritabara_currentUser';