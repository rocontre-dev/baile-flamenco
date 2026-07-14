import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Eye, Search } from 'lucide-react';
import GetStudents from '../../useCases/students/GetStudents';
import GetCourses from '../../useCases/courses/GetCourses';
import styles from './TeacherStudentsPage.module.css';

/**
 * Teacher Students Page
 * Lists only students enrolled in courses taught by the authenticated teacher
 */
const TeacherStudentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allMyStudents, setAllMyStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Get teacher's ID
        const teacherId = user?.id;

        if (!teacherId) {
          console.error('No teacher ID available');
          setIsLoading(false);
          return;
        }

        // Get all courses and filter by teacher
        const allCourses = await GetCourses.execute();
        const teacherCourses = allCourses.filter(course => course.profesorId === teacherId);

        // Get all students
        const allStudents = await GetStudents.execute();

        // Get student profiles to check course enrollment
        const response = await fetch('/data/studentProfiles.json');
        const allProfiles = await response.json();

        // Filter students enrolled in teacher's courses
        const teacherCourseIds = teacherCourses.map(course => course.id);
        const enrolledStudents = allStudents.filter(student => {
          const profile = allProfiles.find(p => p.studentId === student.id);
          if (!profile || !profile.coursesEnrolled) return false;
          return profile.coursesEnrolled.some(courseId => teacherCourseIds.includes(courseId));
        });

        setAllMyStudents(enrolledStudents);

      } catch (error) {
        console.error('Error loading teacher students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Filter by search query using memo
  const filteredStudents = useMemo(() => {
    if (searchQuery.trim()) {
      return allMyStudents.filter(student =>
        student.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return allMyStudents;
  }, [allMyStudents, searchQuery]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Cargando alumnos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Users size={32} className={styles.headerIcon} />
          <div>
            <h1>Mis Alumnos</h1>
            <p className={styles.subtitle}>
              Estudiantes inscritos en tus cursos ({filteredStudents.length})
            </p>
          </div>
        </div>
      </header>

      {/* Search */}
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

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className={styles.studentsGrid}>
          {filteredStudents.map((student) => (
            <div key={student.id} className={styles.studentCard}>
              <div className={styles.studentHeader}>
                <div className={styles.studentAvatar}>
                  <Users size={24} />
                </div>
                <div className={styles.studentInfo}>
                  <h3 className={styles.studentName}>{student.nombre}</h3>
                  <span className={`${styles.studentLevel} ${styles[`level${student.nivel}`]}`}>
                    {student.nivel}
                  </span>
                </div>
              </div>
              <div className={styles.studentDetails}>
                <p className={styles.studentEmail}>{student.email}</p>
                <div className={styles.studentStatus}>
                  <strong>Activo:</strong> {student.activo ? 'Sí' : 'No'}
                </div>
              </div>
              <button
                className={styles.viewProfileButton}
                onClick={() => navigate(`/profesor/alumnos/${student.id}`)}
                aria-label={`Ver perfil de ${student.nombre}`}
              >
                <Eye size={16} />
                Ver perfil
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Users size={48} className={styles.emptyIcon} />
          <p>No se encontraron alumnos en tus cursos.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsPage;