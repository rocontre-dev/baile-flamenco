import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GetTeacherStudents from '../../useCases/teachers/GetTeacherStudents';
import styles from '../academy/AcademyPages.module.css';

/**
 * My Students Page (Teacher)
 * Shows only students enrolled in courses taught by the current teacher
 */
const MyStudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      if (!user) return;
      
      try {
        const teacherStudents = await GetTeacherStudents.execute(user.id);
        setStudents(teacherStudents);
      } catch (err) {
        console.error('Error loading teacher students:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [user]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando mis alumnos...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mis Alumnos</h1>
        <p className={styles.pageSubtitle}>
          {students.length} alumnos en tus cursos
        </p>
      </div>

      {students.length > 0 ? (
        <div className={styles.studentsGrid}>
          {students.map((student) => (
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
                <div className={styles.studentEmail}>
                  <Mail size={14} />
                  <span>{student.email}</span>
                </div>
                <p className={styles.studentLessons}>
                  <strong>Cursos:</strong> {student.assignedCourseIds.length} asignado(s)
                </p>
                <Link
                  to={`/academia/alumnos/${student.id}`}
                  className={styles.viewDetailLink}
                >
                  <Eye size={14} />
                  Ver perfil
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No tienes alumnos inscritos en tus cursos actualmente.</p>
        </div>
      )}
    </div>
  );
};

export default MyStudentsPage;