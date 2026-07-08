import { useState, useEffect } from 'react';
import GetTeachers from '../../useCases/teachers/GetTeachers';
import { GraduationCap, Mail } from 'lucide-react';
import styles from './AcademyPages.module.css';

/**
 * Teachers Page
 * Lists all teachers with their specialties
 */
const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await GetTeachers.execute();
        setTeachers(data);
      } catch (err) {
        console.error('Error loading teachers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando profesores...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Profesores</h1>
        <p className={styles.pageSubtitle}>
          Equipo de {teachers.length} profesores
        </p>
      </div>

      <div className={styles.teachersGrid}>
        {teachers.map((teacher) => (
          <div key={teacher.id} className={styles.teacherCard}>
            <div className={styles.teacherHeader}>
              <div className={styles.teacherAvatar}>
                <GraduationCap size={24} />
              </div>
              <div className={styles.teacherInfo}>
                <h3 className={styles.teacherName}>{teacher.name}</h3>
                <span className={styles.teacherSpecialty}>{teacher.specialty}</span>
              </div>
            </div>
            <p className={styles.teacherBio}>{teacher.bio}</p>
            <div className={styles.teacherContact}>
              <Mail size={14} />
              <span>{teacher.email}</span>
            </div>
            <div className={styles.teacherCourses}>
              <strong>Cursos asignados:</strong> {teacher.assignedCourseIds.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;