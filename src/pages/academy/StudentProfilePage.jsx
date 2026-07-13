import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, BookOpen, Users, Clock, GraduationCap, Eye, Plus, Edit2, Trash2, X, Save, Calendar, Tag, Target, AlertCircle, CheckCircle, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GetStudentProfile from '../../useCases/students/GetStudentProfile';
import GetTeacherStudents from '../../useCases/teachers/GetTeacherStudents';
import GetTeacherNotes from '../../useCases/teachers/GetTeacherNotes';
import GetPracticePlans from '../../useCases/teachers/GetPracticePlans';
import TeacherNotesRepository from '../../repositories/TeacherNotesRepository';
import PracticePlanRepository from '../../repositories/PracticePlanRepository';
import styles from './AcademyPages.module.css';

// Categories for teacher notes
const NOTE_CATEGORIES = [
  'Compás',
  'Técnica',
  'Marcaje',
  'Expresión',
  'Memoria',
  'Escobilla',
  'Palmas',
  'General'
];

// Priorities for practice plans
const PRIORITIES = ['Alta', 'Media', 'Baja'];

// Status for practice plans
const STATUSES = ['Pendiente', 'En Progreso', 'Completado'];

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

// Format date to "DD Mon YYYY" format in Spanish
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Generate unique ID
const generateId = () => `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Student Profile Page
 * Shows detailed academic profile of a student including courses, teachers, and statistics
 */
const StudentProfilePage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [practicePlans, setPracticePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Form state for new/edit note
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ category: 'General', text: '' });
  
  // Form state for new/edit practice plan
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    priority: 'Media',
    dueDate: '',
    status: 'Pendiente'
  });

  useEffect(() => {
    const loadStudentProfile = async () => {
      if (!user) return;

      try {
        // Check access permissions
        // Admin is NOT allowed to see pedagogical profiles (Cuaderno del Profesor, Plan de Práctica)
        if (hasRole('admin')) {
          setAccessDenied(true);
          return;
        }
        
        if (hasRole('teacher')) {
          // Teacher can only see students enrolled in their courses
          const teacherStudents = await GetTeacherStudents.execute(user.id);
          const isOwnStudent = teacherStudents.some(s => s.id === studentId);

          if (!isOwnStudent) {
            setAccessDenied(true);
            return;
          }

          const profile = await GetStudentProfile.execute(studentId);
          if (!profile) {
            navigate('/academia/alumnos');
            return;
          }
          setStudent(profile);
        } else if (hasRole('student')) {
          // Student can view their own profile (only via /mi-perfil route)
          // If accessing via /academia/alumnos/:studentId, deny access
          setAccessDenied(true);
          return;
        } else {
          setAccessDenied(true);
          return;
        }
      } catch (err) {
        console.error('Error loading student profile:', err);
        setAccessDenied(true);
        return;
      } finally {
        setLoading(false);
      }
    };

    loadStudentProfile();
  }, [studentId, user, hasRole, navigate]);

  // Load notes when student data is loaded
  useEffect(() => {
    if (studentId) {
      const loadNotes = async () => {
        try {
          const studentNotes = await GetTeacherNotes.execute(studentId);
          setNotes(studentNotes);
        } catch (err) {
          console.error('Error loading notes:', err);
        }
      };
      loadNotes();
    }
  }, [studentId]);

  // Load practice plans when student data is loaded
  useEffect(() => {
    if (studentId) {
      const loadPracticePlans = async () => {
        try {
          const plans = await GetPracticePlans.execute(studentId);
          setPracticePlans(plans);
        } catch (err) {
          console.error('Error loading practice plans:', err);
        }
      };
      loadPracticePlans();
    }
  }, [studentId]);

  // Check if user can edit notes (admin or teacher with own student)
  const canEditNotes = () => {
    if (hasRole('admin')) return true;
    if (hasRole('teacher') && student) return true;
    return false;
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) return;

    const noteData = {
      ...formData,
      studentId,
      teacherId: user.id,
      date: new Date().toISOString().split('T')[0]
    };

    if (editingNote) {
      // Update existing note
      const updated = await TeacherNotesRepository.update({
        ...editingNote,
        ...noteData
      });
      if (updated) {
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
      }
    } else {
      // Create new note
      const newNote = {
        ...noteData,
        id: generateId()
      };
      await TeacherNotesRepository.add(newNote);
      setNotes([newNote, ...notes]);
    }

    // Reset form
    setShowForm(false);
    setEditingNote(null);
    setFormData({ category: 'General', text: '' });
  };

  // Handle edit button click
  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({ category: note.category, text: note.text });
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (noteId) => {
    if (!window.confirm('¿Eliminar esta observación?')) return;
    
    await TeacherNotesRepository.delete(noteId);
    setNotes(notes.filter(n => n.id !== noteId));
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormData({ category: 'General', text: '' });
  };

  // Handle practice plan form submission
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    
    if (!planFormData.title.trim() || !planFormData.courseId) return;

    const planData = {
      ...planFormData,
      studentId,
      teacherId: user.id,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingPlan) {
      // Update existing plan
      const updated = await PracticePlanRepository.update({
        ...editingPlan,
        ...planData
      });
      if (updated) {
        setPracticePlans(practicePlans.map(p => p.id === updated.id ? updated : p));
      }
    } else {
      // Create new plan
      const newPlan = {
        ...planData,
        id: `plan-${Date.now()}`
      };
      await PracticePlanRepository.add(newPlan);
      setPracticePlans([newPlan, ...practicePlans]);
    }

    // Reset form
    setShowPlanForm(false);
    setEditingPlan(null);
    setPlanFormData({
      courseId: '',
      title: '',
      description: '',
      priority: 'Media',
      dueDate: '',
      status: 'Pendiente'
    });
  };

  // Handle edit plan button click
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      courseId: plan.courseId,
      title: plan.title,
      description: plan.description,
      priority: plan.priority,
      dueDate: plan.dueDate,
      status: plan.status
    });
    setShowPlanForm(true);
  };

  // Handle delete plan button click
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('¿Eliminar este objetivo de práctica?')) return;
    
    await PracticePlanRepository.delete(planId);
    setPracticePlans(practicePlans.filter(p => p.id !== planId));
  };

  // Cancel plan form
  const handleCancelPlan = () => {
    setShowPlanForm(false);
    setEditingPlan(null);
    setPlanFormData({
      courseId: '',
      title: '',
      description: '',
      priority: 'Media',
      dueDate: '',
      status: 'Pendiente'
    });
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    if (!student) return courseId;
    const course = student.assignedCourses.find(c => c.id === courseId);
    return course ? course.name : courseId;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando perfil del alumno...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.comingSoon}>
          <h2>Acceso Restringido</h2>
          <p>No tienes permisos para ver este perfil de alumno.</p>
          <p className={styles.hint}>
            Rol actual: <strong>{user?.role || 'No autenticado'}</strong>
          </p>
          <Link to="/academia" className={styles.backLink}>
            ← Volver
          </Link>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.comingSoon}>
          <h2>Alumno no encontrado</h2>
          <p>No se pudo encontrar el alumno con ID: {studentId}</p>
          <Link to="/academia/alumnos" className={styles.backLink}>
            ← Volver a Alumnos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <Link to="/academia/alumnos" className={styles.backLink}>
          ← Volver a Alumnos
        </Link>
        <div className={styles.courseMetaHeader}>
          <div className={styles.studentAvatar}>
            <User size={32} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>{student.name}</h1>
            <span className={`${styles.levelBadge} ${styles[`level${student.level}`]}`}>
              {student.level}
            </span>
          </div>
        </div>
        <p className={styles.studentEmail}>
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
            Este alumno no está inscrito en ningún curso.
          </div>
        )}
      </div>

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
            Este alumno no tiene profesores asignados.
          </div>
        )}
      </div>

      {/* Teacher Notes Section - Cuaderno del Profesor */}
      <div className={styles.detailSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Cuaderno del Profesor</h2>
          {canEditNotes() && (
            <button
              onClick={() => setShowForm(true)}
              className={styles.practiceButton}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
            >
              <Plus size={14} />
              Nueva observación
            </button>
          )}
        </div>

        {/* Form for new/edit note */}
        {showForm && canEditNotes() && (
          <div className={styles.teacherDetailCard} style={{ marginBottom: 'var(--spacing-lg)' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.9375rem'
                  }}
                >
                  {NOTE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Observación
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Escribe tu observación..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.9375rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: 'white',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  <X size={14} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  <Save size={14} />
                  {editingNote ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes list */}
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
                {canEditNotes() && (
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexShrink: 0, marginLeft: 'var(--spacing-md)' }}>
                    <button
                      onClick={() => handleEdit(note)}
                      style={{
                        padding: 'var(--spacing-sm)',
                        border: 'none',
                        borderRadius: 'var(--border-radius-sm)',
                        backgroundColor: 'transparent',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all var(--transition-fast)'
                      }}
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      style={{
                        padding: 'var(--spacing-sm)',
                        border: 'none',
                        borderRadius: 'var(--border-radius-sm)',
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all var(--transition-fast)'
                      }}
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            No hay observaciones registradas para este alumno.
          </div>
        )}
      </div>

      {/* Practice Plan Section - Plan de Práctica */}
      <div className={styles.detailSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Plan de Práctica</h2>
          {canEditNotes() && (
            <button
              onClick={() => setShowPlanForm(true)}
              className={styles.practiceButton}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
            >
              <Plus size={14} />
              Nuevo objetivo
            </button>
          )}
        </div>

        {/* Form for new/edit practice plan */}
        {showPlanForm && canEditNotes() && (
          <div className={styles.teacherDetailCard} style={{ marginBottom: 'var(--spacing-lg)' }}>
            <form onSubmit={handlePlanSubmit}>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Curso
                </label>
                <select
                  value={planFormData.courseId}
                  onChange={(e) => setPlanFormData({ ...planFormData, courseId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.9375rem'
                  }}
                >
                  <option value="">Seleccionar curso...</option>
                  {student.assignedCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Título
                </label>
                <input
                  type="text"
                  value={planFormData.title}
                  onChange={(e) => setPlanFormData({ ...planFormData, title: e.target.value })}
                  placeholder="Ej: Practicar llamada"
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.9375rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Descripción
                </label>
                <textarea
                  value={planFormData.description}
                  onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                  placeholder="Describe el objetivo de práctica..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.9375rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                    Prioridad
                  </label>
                  <select
                    value={planFormData.priority}
                    onChange={(e) => setPlanFormData({ ...planFormData, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius-md)',
                      fontSize: '0.9375rem'
                    }}
                  >
                    {PRIORITIES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                    Fecha límite
                  </label>
                  <input
                    type="date"
                    value={planFormData.dueDate}
                    onChange={(e) => setPlanFormData({ ...planFormData, dueDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius-md)',
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCancelPlan}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: 'white',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  <X size={14} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  <Save size={14} />
                  {editingPlan ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Practice plans list */}
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
                        <strong>Curso:</strong> {getCourseName(plan.courseId)}
                      </span>
                      <span>
                        <strong>Fecha límite:</strong> {formatDate(plan.dueDate)}
                      </span>
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontSize: '0.9375rem' }}>{plan.description}</p>
                  </div>
                  {canEditNotes() && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexShrink: 0, marginLeft: 'var(--spacing-md)' }}>
                      <button
                        onClick={() => handleEditPlan(plan)}
                        style={{
                          padding: 'var(--spacing-sm)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-sm)',
                          backgroundColor: 'transparent',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all var(--transition-fast)'
                        }}
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        style={{
                          padding: 'var(--spacing-sm)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-sm)',
                          backgroundColor: 'transparent',
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all var(--transition-fast)'
                        }}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            No hay objetivos de práctica asignados para este alumno.
          </div>
        )}
      </div>

      {/* Future Sections - Placeholders */}
      <div className={styles.dashboardSections}>
        {/* Progress Section */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Progreso</h2>
          <div className={styles.comingSoon} style={{ minHeight: '150px', padding: 'var(--spacing-lg)' }}>
            <p className={styles.comingSoonText}>Próximamente</p>
          </div>
        </div>

        {/* Practice Goals Section */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Objetivos de Práctica</h2>
          <div className={styles.comingSoon} style={{ minHeight: '150px', padding: 'var(--spacing-lg)' }}>
            <p className={styles.comingSoonText}>Próximamente</p>
          </div>
        </div>

        {/* History Section */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Historial</h2>
          <div className={styles.comingSoon} style={{ minHeight: '150px', padding: 'var(--spacing-lg)' }}>
            <p className={styles.comingSoonText}>Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;