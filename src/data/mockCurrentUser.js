/**
 * Mock Current User
 * 
 * Este archivo define el usuario actual para propósitos de desarrollo.
 * Para cambiar de rol, simplemente modifica el objeto exportado.
 * 
 * Roles disponibles:
 * - "admin": Acceso completo a toda la academia
 * - "teacher": Acceso a dashboard, mis cursos y mis alumnos
 * - "student": Acceso solo a mis cursos y practice player
 */

export const mockCurrentUser = {
  // Rol actual: descomentar uno de los siguientes bloques
  
  // ===== ADMIN =====
  // id: "admin-1",
  // role: "admin",
  // name: "Administrador",
  
  // ===== TEACHER =====
  id: "teacher-1",
  role: "teacher",
  name: "Rodrigo Robles",
  
  // ===== STUDENT =====
  // id: "student-1",
  // role: "student",
  // name: "María López"
};

export default mockCurrentUser;
