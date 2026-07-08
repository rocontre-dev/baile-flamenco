import { useState, useEffect } from 'react';
import GetStudents from '../../useCases/students/GetStudents';
import GetCourses from '../../useCases/courses/GetCourses';
import { Search, Users, BookOpen } from 'lucide-react';
import styles from './AcademyPages.module.css';

/**
 * Students Page
 * Lists all students with search, filter, and assigned courses
 */
const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, coursesData] = await Promise.all([
          GetStudents.execute(),
          GetCourses.execute()
        ]);
        setStudents(studentsData);
        setCourses(coursesData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || student.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  // Get course names for a student
  const getStudentCourses = (student) => {
    return courses.filter(course => 
      student.assignedCourseIds.includes(course.id)
    );
  };

  const levels = ['Principiante', 'Intermedio', 'Avanzado'];

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando alumnos...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Alumnos</h1>
        <p className={styles.pageSubtitle}>
          Gestionando {filteredStudents.length} de {students.length} alumnos
        </p>
      </div>

      {/* Search and Filter */}
      <div className={styles.filtersBar}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterContainer}>
          <label className={styles.filterLabel}>Nivel:</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className={styles.studentsGrid}>
          {filteredStudents.map((student) => {
            const studentCourses = getStudentCourses(student);
            return (
              <div key={student.id} className={styles.studentCard}>
                <div className={styles.studentHeader}>
                  <div className={styles.studentAvatar}>
                    <Users size={24} />
                  </div>
                  <div className={styles.studentInfo}>
                    <h3 className={styles.studentName}>{student.name}</h3>
                    <span className={`${styles.studentLevel} ${styles[`level${student.level}`]}`}>
                      {student.level}
                    </span>
                  </div>
                </div>
                <div className={styles.studentDetails}>
                  <p className={styles.studentEmail}>{student.email}</p>
                  <div className={styles.studentCourses}>
                    <BookOpen size={14} />
                    <span>
                      <strong>Cursos:</strong> {studentCourses.length} asignado(s)
                    </span>
                  </div>
                  {studentCourses.length > 0 && (
                    <div className={styles.studentCourseList}>
                      {studentCourses.map(course => (
                        <span key={course.id} className={styles.courseTag}>
                          {course.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No se encontraron alumnos con los criterios actuales.</p>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;