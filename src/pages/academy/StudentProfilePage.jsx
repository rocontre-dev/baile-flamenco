import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GetStudentProfile from '../../useCases/studentProfiles/GetStudentProfile';
import GetStudent from '../../useCases/students/GetStudent';
import CanTeacherAccessStudent from '../../useCases/studentProfiles/CanTeacherAccessStudent';
import { BookOpen, Clock, TrendingUp, Calendar, User, ChevronLeft, AlertCircle, CheckCircle, Circle, Target, MessageSquare, Play, Bookmark } from 'lucide-react';
import styles from './StudentProfilePage.module.css';

/**
 * Student Academic Profile Page
 * Reusable page for admin, teacher, and student roles
 */
const StudentProfilePage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setError(null);
      setIsLoading(true);

      try {
        // Determine which student ID to use
        let targetStudentId = studentId;

        // Student role can only view their own profile
        if (hasRole('student') || hasRole('STUDENT')) {
          targetStudentId = user?.id;
          if (!targetStudentId) {
            throw new Error('No student ID available');
          }
        }

        if (!targetStudentId) {
          throw new Error('Student ID is required');
        }

        // Teacher authorization check
        if (hasRole('teacher') || hasRole('TEACHER')) {
          const teacherId = user?.id;
          const canAccess = await CanTeacherAccessStudent.execute(teacherId, targetStudentId);
          if (!canAccess) {
            setAccessDenied(true);
            setIsLoading(false);
            return;
          }
        }

        // Load student basic data
        const studentData = await GetStudent.execute(targetStudentId);
        if (!studentData) {
          throw new Error('Student not found');
        }
        setStudent(studentData);

        // Load student academic profile
        const profileData = await GetStudentProfile.execute(targetStudentId);
        setProfile(profileData);

      } catch (err) {
        console.error('Error loading student profile:', err);
        setError(err.message || 'Error loading profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [studentId, user, hasRole]);

  // Helper to format practice time
  const formatPracticeTime = (minutes) => {
    if (!minutes && minutes !== 0) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours} h ${mins} min`;
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper to format time (MM:SS)
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get progress percentage safely
  const getProgress = () => {
    if (!profile || !profile.totalLessons || profile.totalLessons === 0) return 0;
    return Math.round((profile.completedLessons / profile.totalLessons) * 100);
  };

  // Get back button text based on role
  const getBackRoute = () => {
    if (hasRole('admin') || hasRole('ADMIN')) return '/administrador/alumnos';
    if (hasRole('teacher') || hasRole('TEACHER')) return '/profesor/alumnos';
    return '/alumno/cursos';
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Cargando perfil...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <AlertCircle size={48} className={styles.notFoundIcon} />
          <h2 className={styles.notFoundTitle}>Acceso denegado</h2>
          <p className={styles.notFoundText}>
            No tienes permiso para ver este perfil.
          </p>
          <button
            className={styles.backButton}
            onClick={() => navigate(getBackRoute())}
          >
            <ChevronLeft size={18} />
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <AlertCircle size={48} className={styles.notFoundIcon} />
          <h2 className={styles.notFoundTitle}>Alumno no encontrado</h2>
          <p className={styles.notFoundText}>
            No se pudo encontrar el perfil del alumno solicitado.
          </p>
          <button
            className={styles.backButton}
            onClick={() => navigate(getBackRoute())}
          >
            <ChevronLeft size={18} />
            Volver
          </button>
        </div>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <div className={styles.container}>
      {/* Back Button and Notebook Link */}
      <div className={styles.headerActions}>
        <button
          className={styles.backButton}
          onClick={() => navigate(getBackRoute())}
        >
          <ChevronLeft size={18} />
          Volver
        </button>
        {(hasRole('teacher') || hasRole('TEACHER')) && (
          <Link to={`/profesor/alumnos/${student.id}/cuaderno`} className={styles.notebookLink}>
            <BookOpen size={16} />
            Abrir cuaderno
          </Link>
        )}
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerAvatar}>
          <User size={32} />
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerName}>{student.nombre}</h1>
          <div className={styles.headerMeta}>
            <span className={`${styles.badge} ${styles[`badge${student.nivel}`]}`}>
              {student.nivel}
            </span>
            <span className={`${styles.badge} ${student.activo ? styles.badgeActive : styles.badgeInactive}`}>
              {student.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          {student.email && (
            <p className={styles.headerEmail}>{student.email}</p>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>
              {profile?.coursesEnrolled?.length || 0}
            </span>
            <span className={styles.summaryLabel}>Cursos inscritos</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>
              {profile?.completedLessons || 0} de {profile?.totalLessons || 0}
            </span>
            <span className={styles.summaryLabel}>Lecciones completadas</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>{progress}%</span>
            <span className={styles.summaryLabel}>Progreso general</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>
              {formatPracticeTime(profile?.totalPracticeMinutes)}
            </span>
            <span className={styles.summaryLabel}>Tiempo practicado</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Calendar size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>
              {formatDate(profile?.lastPracticeAt)}
            </span>
            <span className={styles.summaryLabel}>Última práctica</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Enrolled Courses */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cursos inscritos</h2>
          {profile?.coursesEnrolled && profile.coursesEnrolled.length > 0 ? (
            <div className={styles.coursesList}>
              {/* Course cards would be rendered here with real course data */}
              <div className={styles.courseCard}>
                <div className={styles.courseHeader}>
                  <h3 className={styles.courseName}>Iniciación al Flamenco</h3>
                  <span className={`${styles.courseLevel} ${styles.levelPrincipiante}`}>
                    Principiante
                  </span>
                </div>
                <div className={styles.courseProgress}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>
                    {profile.completedLessons || 0} de {profile.totalLessons || 0} lecciones ({progress}%)
                  </span>
                </div>
                <Link to={`/academia/cursos/a1b2c3d4-e5f6-7890-abcd-ef1234567890`} className={styles.courseLink}>
                  Ver curso <ChevronLeft size={14} className={styles.courseLinkIcon} />
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <BookOpen size={32} className={styles.emptyIcon} />
              <p>No hay cursos inscritos</p>
            </div>
          )}
        </section>

        {/* Goals */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Objetivos actuales</h2>
          {profile?.goals && profile.goals.length > 0 ? (
            <div className={styles.goalsList}>
              {profile.goals.map(goal => (
                <div key={goal.id} className={styles.goalCard}>
                  <div className={styles.goalHeader}>
                    <h3 className={styles.goalTitle}>{goal.title}</h3>
                    <span className={`${styles.goalStatus} ${styles[`status${goal.status.replace(/\s+/g, '')}`]}`}>
                      {goal.status === 'Completado' ? <CheckCircle size={16} /> :
                       goal.status === 'En progreso' ? <TrendingUp size={16} /> :
                       <Circle size={16} />}
                      {goal.status}
                    </span>
                  </div>
                  {goal.description && (
                    <p className={styles.goalDescription}>{goal.description}</p>
                  )}
                  {goal.dueDate && (
                    <span className={styles.goalDueDate}>
                      <Calendar size={14} /> {formatDate(goal.dueDate)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Target size={32} className={styles.emptyIcon} />
              <p>No hay objetivos registrados</p>
            </div>
          )}
        </section>

        {/* Teacher Notes */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Notas del profesor</h2>
          {profile?.teacherNotes && profile.teacherNotes.length > 0 ? (
            <div className={styles.notesList}>
              {profile.teacherNotes.map(note => (
                <div key={note.id} className={styles.noteCard}>
                  <div className={styles.noteHeader}>
                    <MessageSquare size={16} className={styles.noteIcon} />
                    <span className={styles.noteAuthor}>{note.teacherName}</span>
                    <span className={styles.noteDate}>{formatDate(note.createdAt)}</span>
                  </div>
                  <p className={styles.noteText}>{note.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <MessageSquare size={32} className={styles.emptyIcon} />
              <p>No hay notas del profesor</p>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Actividad reciente</h2>
          {profile?.recentActivity && profile.recentActivity.length > 0 ? (
            <div className={styles.activityList}>
              {profile.recentActivity.slice(0, 5).map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === 'practice' ? <Play size={18} /> : <CheckCircle size={18} />}
                  </div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>{activity.lessonTitle}</span>
                    <span className={styles.activityCourse}>{activity.courseTitle}</span>
                    {activity.duration && (
                      <span className={styles.activityDuration}>{activity.duration} min</span>
                    )}
                  </div>
                  <span className={styles.activityDate}>
                    {formatDate(activity.practicedAt || activity.completedAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Clock size={32} className={styles.emptyIcon} />
              <p>No hay actividad reciente</p>
            </div>
          )}
        </section>

        {/* Bookmarks */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Marcadores recientes</h2>
          {profile?.bookmarks && profile.bookmarks.length > 0 ? (
            <div className={styles.bookmarksList}>
              {profile.bookmarks.slice(0, 5).map(bookmark => (
                <div key={bookmark.id} className={styles.bookmarkItem}>
                  <Bookmark size={18} className={styles.bookmarkIcon} />
                  <div className={styles.bookmarkContent}>
                    <span className={styles.bookmarkName}>{bookmark.name}</span>
                    <span className={styles.bookmarkLesson}>{bookmark.lessonTitle}</span>
                  </div>
                  <span className={styles.bookmarkTime}>{formatTime(bookmark.timeSeconds)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Bookmark size={32} className={styles.emptyIcon} />
              <p>No hay marcadores guardados</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentProfilePage;