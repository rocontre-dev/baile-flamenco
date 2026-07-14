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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeachers = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const data = await GetTeachers.execute();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTeachers(data);
        } else {
          console.error('Teachers data is not an array:', data);
          setTeachers([]);
        }
      } catch (err) {
        console.error('Error loading teachers:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeachers();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Cargando profesores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <p>No fue posible cargar los profesores. Por favor, intenta de nuevo.</p>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className={styles.loading}>
        <p>No hay profesores registrados.</p>
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
                <h3 className={styles.teacherName}>{teacher.nombre}</h3>
                <span className={styles.teacherSpecialty}>{teacher.especialidades?.join(', ')}</span>
              </div>
            </div>
            <p className={styles.teacherBio}>{teacher.biografia}</p>
            <div className={styles.teacherContact}>
              <Mail size={14} />
              <span>{teacher.redesSociales?.instagram || 'N/A'}</span>
            </div>
            <div className={styles.teacherCourses}>
              <strong>Activo:</strong> {teacher.activo ? 'Sí' : 'No'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;