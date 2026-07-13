import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, Users, Clock, GraduationCap, Play, ArrowRight, Calendar, Tag, Target, AlertCircle, CheckCircle, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GetStudentProfile from '../../useCases/students/GetStudentProfile';
import GetTeacherNotes from '../../useCases/teachers/GetTeacherNotes';
import GetPracticePlans from '../../useCases/teachers/GetPracticePlans';
import styles from '../academy/AcademyPages.module.css';

// Format date to "DD Mon YYYY" format in Spanish
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Priority badge colors
const priorityColors = {
  'Alta': { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' },
  'Media': { bg: 'rgba(251, 191, 36, 0.15)', color: '#ca8a04' },
  'Baja': { bg: 'rgba(34, 197, 94, 0.15)', color: '#16a34a' }
};

// Status badge colors
const statusColors = {
  'Pendiente': { bg: 'rgba(156, 163, 175, 0.15)', color: '#6b7280' },
  'En Progreso': { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' },
  'Completado': { bg: 'rgba(34, 197, 94, 0.15)', color: '#16a34a' }
};

// Status icons
const statusIcons = {
  'Pendiente': Circle,
  'En Progreso': AlertCircle,
  'Completado': CheckCircle
};

// Normalize palo name for URL
const normalizePaloName = (palo) => {
  return palo.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * My Profile Page (Student)
 * Shows the student's own academic profile - read only
 */
const MyProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [practicePlans, setPracticePlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || user.role !== 'student') {
        navigate('/mis-cursos');
        return;
      }

      try {
        // Load student profile using current user ID
        const profile = await GetStudentProfile.execute(user.id);
        if (!profile) {
          navigate('/mis-cursos');
          return;
        }
        setStudent(profile);

        // Load teacher notes for this student
        const studentNotes = await GetTeacherNotes.execute(user.id);
        setNotes(studentNotes);

        // Load practice plans for this student
        const plans = await GetPracticePlans.execute(user.id);
        setPracticePlans(plans);
      } catch (err) {
        console.error('Error loading student profile:', err);
        navigate('/mis-cursos');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando mi perfil...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.comingSoon}>
          <h2>Perfil no disponible</h2>
          <p>No se pudo cargar tu perfil.</p>
          <Link to="/mis-cursos" className={styles.backLink}>
            ← Volver a Mis Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mi Perfil</h1>
        <div className={styles.courseMetaHeader} style={{ marginTop: 'var(--spacing-lg)' }}>
          <div className={styles.studentAvatar}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 var(--spacing-xs) 0' }}>
              {student.name}
            </h2>
            <span className={`${styles.levelBadge} ${styles[`level${student.level}`]}`}>
              {student.level}
            </span>
          </div>
        </div>
        <p className={styles.studentEmail} style={{ marginTop: 'var(--spacing-md)' }}>
          <Mail size={14} /> {student.email}
        </p>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{student.totalCourses}</span>
            <span className={styles.statLabel}>Cursos inscritos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <GraduationCap size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{student.totalLessons}</span>
            <span className={styles.statLabel}>Lecciones asignadas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{student.teachers.length}</span>
            <span className={styles.statLabel}>Profesores</span>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className={styles.detailSection}>
        <h2 className={styles.sectionTitle}>Cursos Inscritos</h2>
        {student.assignedCourses.length > 0 ? (
          <div className={styles.enrolledList}>
            {student.assignedCourses.map((course) => (
              <div key={course.id} className={styles.enrolledItem}>
                <div className={styles.enrolledInfo}>
                  <div>
                    <span className={styles.enrolledName}>{course.name}</span>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
                      <span className={styles.paloTag}>{course.palo}</span>
                      <span className={`${styles.levelBadge} ${styles[`level${course.level}`]}`}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span className={styles.enrolledEmail}>
                    <Clock size={12} /> {course.lessons.length} lecciones
                  </span>
                  {course.teacher && (
                    <span className={styles.enrolledEmail}>
                      <User size={12} /> {course.teacher.name}
                    </span>
                  )}
                  <Link
                    to={`/academia/cursos/${course.id}`}
                    className={styles.practiceButton}
                  >
                    Ver curso
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            No estás inscrito en ningún curso.
          </div>
        )}
      </div>

      {/* Lessons with Practice buttons */}
      {student.assignedCourses.length > 0 && (
        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>Lecciones para Practicar</h2>
          {student.assignedCourses.flatMap((course) =>
            course.lessons.map((lessonId, index) => (
              <div key={`${course.id}-${lessonId}`} className={styles.lessonItem}>
                <div className={styles.lessonInfo}>
                  <span className={styles.lessonNumber}>
                    {course.name} - Lección {index + 1}
                  </span>
                  <span className={styles.lessonId}>{lessonId}</span>
                </div>
                <Link
                  to={`/palos/${normalizePaloName(course.palo)}/${lessonId.split('-')[0]}/${lessonId}`}
                  className={styles.practiceButton}
                >
                  <Play size={14} />
                  Practicar
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Teachers */}
      <div className={styles.detailSection}>
        <h2 className={styles.sectionTitle}>Profesores Relacionados</h2>
        {student.teachers.length > 0 ? (
          <div className={styles.teachersList}>
            {student.teachers.map((teacher) => (
              <div key={teacher.id} className={styles.teacherItem}>
                <div className={styles.teacherInfo}>
                  <span className={styles.teacherName}>{teacher.name}</span>
                  <span className={styles.teacherSpecialty}>{teacher.specialty}</span>
                </div>
                <span className={styles.teacherContact}>
                  <Mail size={12} /> {teacher.email}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            No tienes profesores asignados.
          </div>
        )}
      </div>

      {/* Teacher Notes Section - Cuaderno del Profesor (Read Only) */}
      <div className={styles.detailSection}>
        <h2 className={styles.sectionTitle}>Cuaderno del Profesor</h2>
        {notes.length > 0 ? (
          <div className={styles.lessonsList}>
            {notes.map((note) => (
              <div key={note.id} className={styles.lessonItem} style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      <Calendar size={12} />
                      {formatDate(note.date)}
                    </span>
                    <span className={styles.paloTag} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <Tag size={10} />
                      {note.category}
                    </span>
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{note.text}</p>
                </div>
                {/* No edit/delete buttons for student - read only */}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            No hay observaciones registradas todavía.
          </div>
        )}
      </div>

      {/* Practice Plan Section - Plan de Práctica (Read Only) */}
      <div className={styles.detailSection}>
        <h2 className={styles.sectionTitle}>Plan de Práctica</h2>
        {practicePlans.length > 0 ? (
          <div className={styles.lessonsList}>
            {practicePlans.map((plan) => {
              const StatusIcon = statusIcons[plan.status] || Circle;
              return (
                <div key={plan.id} className={styles.lessonItem} style={{ alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)' }}>{plan.title}</span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: priorityColors[plan.priority]?.bg,
                        color: priorityColors[plan.priority]?.color
                      }}>
                        {plan.priority}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: statusColors[plan.status]?.bg,
                        color: statusColors[plan.status]?.color
                      }}>
                        <StatusIcon size={10} />
                        {plan.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xs)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      <span>
                        <strong>Curso:</strong> {student.assignedCourses.find(c => c.id === plan.courseId)?.name || plan.courseId}
                      </span>
                      <span>
                        <strong>Fecha límite:</strong> {formatDate(plan.dueDate)}
                      </span>
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontSize: '0.9375rem' }}>{plan.description}</p>
                  </div>
                  {/* No edit/delete buttons for student - read only */}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            No hay objetivos de práctica asignados todavía.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;
