/**
 * Mock data for courses - Academia section
 * Frontend-only mock data for demonstration purposes
 */

export const mockCourses = [
  {
    id: "course-tangos-1",
    name: "Tangos - Nivel Principiante",
    palo: "Tangos",
    level: "Principiante",
    teacherId: "teacher-1",
    description: "Introducción al mundo de los tangos. Aprende los compases básicos, marcajes y remates fundamentales.",
    lessons: ["tangos-compas-basico", "tangos-marcaje-1", "tangos-remate-basico"],
    duration: "4 semanas",
    studentCount: 4
  },
  {
    id: "course-alegrias-1",
    name: "Alegrías - Nivel Principiante",
    palo: "Alegrías",
    level: "Principiante",
    teacherId: "teacher-1",
    description: "Primer contacto con las alegrías. Compás de 12 tiempos, silencio, llamada y cierre básico.",
    lessons: ["alegrias-compas", "alegrias-silencio", "alegrias-llamada"],
    duration: "6 semanas",
    studentCount: 3
  },
  {
    id: "course-solea-1",
    name: "Soleá - Nivel Intermedio",
    palo: "Soleá",
    level: "Intermedio",
    teacherId: "teacher-2",
    description: "Profundización en la soleá. Trabajo de compás, expresión corporal y primeros pasos de baile.",
    lessons: ["solea-compas", "solea-expresion", "solea-pasos"],
    duration: "8 semanas",
    studentCount: 2
  },
  {
    id: "course-alegrias-2",
    name: "Alegrías - Nivel Avanzado",
    palo: "Alegrías",
    level: "Avanzado",
    teacherId: "teacher-4",
    description: "Perfeccionamiento de alegrías. Escobillas, llamadas complejas y variaciones avanzadas.",
    lessons: ["alegrias-escobilla", "alegrias-avanzado"],
    duration: "10 semanas",
    studentCount: 1
  },
  {
    id: "course-fandangos-1",
    name: "Fandangos - Nivel Intermedio",
    palo: "Fandangos",
    level: "Intermedio",
    teacherId: "teacher-3",
    description: "Estilo personal en fandangos. Trabajo de braceo, vueltas y expresión artística.",
    lessons: ["fandangos-braceo", "fandangos-vueltas"],
    duration: "6 semanas",
    studentCount: 2
  }
];

export default mockCourses;