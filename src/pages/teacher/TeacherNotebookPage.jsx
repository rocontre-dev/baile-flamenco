import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GetTeacherNotebook from '../../useCases/teacherNotebook/GetTeacherNotebook';
import ManageObservations from '../../useCases/teacherNotebook/ManageObservations';
import ManageGoals from '../../useCases/teacherNotebook/ManageGoals';
import ManageAssignments from '../../useCases/teacherNotebook/ManageAssignments';
import SaveAssessment from '../../useCases/teacherNotebook/SaveAssessment';
import SaveNextReview from '../../useCases/teacherNotebook/SaveNextReview';
import GetCourses from '../../useCases/courses/GetCourses';
import {
  ChevronLeft, AlertCircle, BookOpen, Target, ClipboardList, Star, Calendar,
  Plus, Edit2, Trash2, Save, X, CheckCircle, Circle, Clock
} from 'lucide-react';
import styles from './TeacherNotebookPage.module.css';

const ASSESSMENT_LEVELS = ['Inicial', 'En desarrollo', 'Adecuado', 'Sólido', 'Destacado'];
const GOAL_STATUSES = ['Pendiente', 'En progreso', 'Completado'];
const ASSIGNMENT_STATUSES = ['Pendiente', 'En progreso', 'Completada'];

const TeacherNotebookPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [notebook, setNotebook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Form states
  const [observationForm, setObservationForm] = useState({ open: false, text: '', editingId: null });
  const [goalForm, setGoalForm] = useState({ open: false, title: '', description: '', status: 'Pendiente', targetDate: '', editingId: null });
  const [assignmentForm, setAssignmentForm] = useState({ open: false, title: '', instructions: '', status: 'Pendiente', dueDate: '', editingId: null });
  const [assessmentForm, setAssessmentForm] = useState({ compas: '', coordinacion: '', tecnica: '', memoria: '', expresion: '', comment: '' });
  const [nextReviewForm, setNextReviewForm] = useState({ date: '', note: '' });

  const teacherId = user?.id;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setError(null);
      setAccessDenied(false);
      setIsLoading(true);

      try {
        if (!teacherId || !studentId) {
          throw new Error('Datos insuficientes');
        }

        // Get notebook data through use case
        const result = await GetTeacherNotebook.execute(teacherId, studentId);

        if (!result.success) {
          if (result.error === 'Alumno no encontrado') {
            throw new Error('Alumno no encontrado');
          }
          setAccessDenied(true);
          setIsLoading(false);
          return;
        }

        setStudent(result.data.student);

        // Get teacher's courses
        const allCourses = await GetCourses.execute();
        const courses = allCourses.filter(c => c.profesorId === teacherId);
        setTeacherCourses(courses);

        // Set notebook data
        setNotebook(result.data.notebook);

        // Initialize forms with existing data
        if (result.data.notebook.assessment) {
          setAssessmentForm({
            compas: result.data.notebook.assessment.compas || '',
            coordinacion: result.data.notebook.assessment.coordinacion || '',
            tecnica: result.data.notebook.assessment.tecnica || '',
            memoria: result.data.notebook.assessment.memoria || '',
            expresion: result.data.notebook.assessment.expresion || '',
            comment: result.data.notebook.assessment.comment || '',
          });
        }

        if (result.data.notebook.nextReview) {
          setNextReviewForm({
            date: result.data.notebook.nextReview.date ? result.data.notebook.nextReview.date.split('T')[0] : '',
            note: result.data.notebook.nextReview.note || '',
          });
        }

      } catch (err) {
        console.error('Error loading notebook:', err);
        setError(err.message || 'Error cargando datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [studentId, teacherId]);

  // Get shared courses between student and teacher
  const getSharedCourses = useCallback(() => {
    if (!notebook || !teacherCourses.length) return [];
    const enrolledCourseIds = notebook.coursesEnrolled || [];
    return teacherCourses.filter(c => enrolledCourseIds.includes(c.id));
  }, [notebook, teacherCourses]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Observation handlers
  const handleAddObservation = async () => {
    const result = await ManageObservations.add(teacherId, studentId, observationForm.text);
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        observations: [result.data, ...(prev?.observations || [])]
      }));
      setObservationForm({ open: false, text: '', editingId: null });
    }
    // Keep form content on error
  };

  const handleUpdateObservation = async () => {
    const result = await ManageObservations.update(teacherId, studentId, observationForm.editingId, observationForm.text);
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        observations: prev.observations.map(o => o.id === result.data.id ? result.data : o)
      }));
      setObservationForm({ open: false, text: '', editingId: null });
    }
    // Keep form content on error
  };

  const handleDeleteObservation = async (id) => {
    if (!window.confirm('¿Eliminar esta observación?')) return;
    const result = await ManageObservations.delete(teacherId, studentId, id);
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        observations: prev.observations.filter(o => o.id !== id)
      }));
    }
  };

  // Goal handlers
  const handleAddGoal = async () => {
    const result = await ManageGoals.add(teacherId, studentId, {
      title: goalForm.title,
      description: goalForm.description,
      status: goalForm.status,
      targetDate: goalForm.targetDate || null
    });
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        goals: [...(prev?.goals || []), result.data]
      }));
      setGoalForm({ open: false, title: '', description: '', status: 'Pendiente', targetDate: '', editingId: null });
    }
    // Keep form content on error
  };

  const handleUpdateGoal = async () => {
    const result = await ManageGoals.update(teacherId, studentId, goalForm.editingId, {
      title: goalForm.title,
      description: goalForm.description,
      status: goalForm.status,
      targetDate: goalForm.targetDate || null
    });
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        goals: prev.goals.map(g => g.id === result.data.id ? result.data : g)
      }));
      setGoalForm({ open: false, title: '', description: '', status: 'Pendiente', targetDate: '', editingId: null });
    }
    // Keep form content on error
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('¿Eliminar este objetivo?')) return;
    const result = await ManageGoals.delete(teacherId, studentId, id);
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        goals: prev.goals.filter(g => g.id !== id)
      }));
    }
  };

  // Assignment handlers
  const handleAddAssignment = async () => {
    const result = await ManageAssignments.add(teacherId, studentId, {
      title: assignmentForm.title,
      instructions: assignmentForm.instructions,
      status: assignmentForm.status,
      dueDate: assignmentForm.dueDate || null
    });
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        assignments: [...(prev?.assignments || []), result.data]
      }));
      setAssignmentForm({ open: false, title: '', instructions: '', status: 'Pendiente', dueDate: '', editingId: null });
    }
    // Keep form content on error
  };

  const handleUpdateAssignment = async () => {
    const result = await ManageAssignments.update(teacherId, studentId, assignmentForm.editingId, {
      title: assignmentForm.title,
      instructions: assignmentForm.instructions,
      status: assignmentForm.status,
      dueDate: assignmentForm.dueDate || null
    });
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        assignments: prev.assignments.map(a => a.id === result.data.id ? result.data : a)
      }));
      setAssignmentForm({ open: false, title: '', instructions: '', status: 'Pendiente', dueDate: '', editingId: null });
    }
    // Keep form content on error
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    const result = await ManageAssignments.delete(teacherId, studentId, id);
    if (result.success) {
      setNotebook(prev => ({
        ...prev,
        assignments: prev.assignments.filter(a => a.id !== id)
      }));
    }
  };

  // Assessment handler
  const handleSaveAssessment = async () => {
    const result = await SaveAssessment.execute(teacherId, studentId, assessmentForm);
    if (result.success) {
      setNotebook(prev => ({ ...prev, assessment: result.data }));
    }
    // Keep form content on error
  };

  // Next review handler
  const handleSaveNextReview = async () => {
    const result = await SaveNextReview.execute(teacherId, studentId, {
      date: nextReviewForm.date,
      note: nextReviewForm.note
    });
    if (result.success) {
      setNotebook(prev => ({ ...prev, nextReview: result.data }));
    }
    // Keep form content on error
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Cargando cuaderno...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h2>Acceso denegado</h2>
          <p>No tienes permiso para acceder al cuaderno de este alumno.</p>
          <button className={styles.backButton} onClick={() => navigate('/profesor/alumnos')}>
            <ChevronLeft size={18} /> Volver
          </button>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h2>Alumno no encontrado</h2>
          <p>{error || 'No se pudo encontrar el alumno.'}</p>
          <button className={styles.backButton} onClick={() => navigate('/profesor/alumnos')}>
            <ChevronLeft size={18} /> Volver
          </button>
        </div>
      </div>
    );
  }

  const sharedCourses = getSharedCourses();

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={() => navigate('/profesor/alumnos')}>
            <ChevronLeft size={18} /> Volver a Mis Alumnos
          </button>
          <Link to={`/profesor/alumnos/${studentId}`} className={styles.profileLink}>
            Ver perfil académico
          </Link>
        </div>
        <div className={styles.headerContent}>
          <h1>Cuaderno de {student.nombre}</h1>
          <div className={styles.headerMeta}>
            <span className={`${styles.badge} ${styles[`level${student.nivel}`]}`}>{student.nivel}</span>
            <span className={`${styles.badge} ${student.activo ? styles.badgeActive : styles.badgeInactive}`}>
              {student.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          {sharedCourses.length > 0 && (
            <p className={styles.coursesInfo}>
              Cursos compartidos: {sharedCourses.map(c => c.titulo).join(', ')}
            </p>
          )}
        </div>
      </header>

      {/* Summary */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <Target size={24} className={styles.summaryIcon} />
          <div>
            <span className={styles.summaryValue}>
              {notebook?.goals?.filter(g => g.status !== 'Completado').length || 0}
            </span>
            <span className={styles.summaryLabel}>Objetivos activos</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <ClipboardList size={24} className={styles.summaryIcon} />
          <div>
            <span className={styles.summaryValue}>
              {notebook?.assignments?.filter(a => a.status !== 'Completada').length || 0}
            </span>
            <span className={styles.summaryLabel}>Tareas pendientes</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <Star size={24} className={styles.summaryIcon} />
          <div>
            <span className={styles.summaryValue}>
              {notebook?.assessment ? 'Sí' : 'No'}
            </span>
            <span className={styles.summaryLabel}>Valoración</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <Calendar size={24} className={styles.summaryIcon} />
          <div>
            <span className={styles.summaryValue}>
              {notebook?.nextReview?.date ? formatDate(notebook.nextReview.date) : 'Sin fecha'}
            </span>
            <span className={styles.summaryLabel}>Próxima revisión</span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Observations */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Observaciones</h2>
            {!observationForm.open ? (
              <button className={styles.addButton} onClick={() => setObservationForm({ open: true, text: '', editingId: null })}>
                <Plus size={16} /> Nueva
              </button>
            ) : null}
          </div>

          {observationForm.open && (
            <div className={styles.formCard}>
              <textarea
                className={styles.textarea}
                placeholder="Escribe una observación..."
                value={observationForm.text}
                onChange={(e) => setObservationForm(prev => ({ ...prev, text: e.target.value }))}
                rows={4}
              />
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => setObservationForm({ open: false, text: '', editingId: null })}>
                  <X size={16} /> Cancelar
                </button>
                <button className={styles.saveButton} onClick={observationForm.editingId ? handleUpdateObservation : handleAddObservation}>
                  <Save size={16} /> {observationForm.editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          )}

          <div className={styles.observationsList}>
            {notebook?.observations?.length > 0 ? (
              [...notebook.observations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(obs => (
                <div key={obs.id} className={styles.observationCard}>
                  <div className={styles.observationHeader}>
                    <span className={styles.observationDate}>{formatDate(obs.createdAt)}</span>
                    <div className={styles.observationActions}>
                      <button className={styles.iconButton} onClick={() => setObservationForm({ open: true, text: obs.text, editingId: obs.id })}>
                        <Edit2 size={14} />
                      </button>
                      <button className={styles.iconButton} onClick={() => handleDeleteObservation(obs.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className={styles.observationText}>{obs.text}</p>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <BookOpen size={32} className={styles.emptyIcon} />
                <p>Sin observaciones</p>
              </div>
            )}
          </div>
        </section>

        {/* Goals */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Objetivos</h2>
            {!goalForm.open ? (
              <button className={styles.addButton} onClick={() => setGoalForm({ open: true, title: '', description: '', status: 'Pendiente', targetDate: '', editingId: null })}>
                <Plus size={16} /> Nuevo
              </button>
            ) : null}
          </div>

          {goalForm.open && (
            <div className={styles.formCard}>
              <input
                className={styles.input}
                placeholder="Título del objetivo"
                value={goalForm.title}
                onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
              />
              <textarea
                className={styles.textarea}
                placeholder="Descripción (opcional)"
                value={goalForm.description}
                onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
              <div className={styles.formRow}>
                <select
                  className={styles.select}
                  value={goalForm.status}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  {GOAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  type="date"
                  className={styles.input}
                  value={goalForm.targetDate || ''}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => setGoalForm({ open: false, title: '', description: '', status: 'Pendiente', targetDate: '', editingId: null })}>
                  <X size={16} /> Cancelar
                </button>
                <button className={styles.saveButton} onClick={goalForm.editingId ? handleUpdateGoal : handleAddGoal}>
                  <Save size={16} /> {goalForm.editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          )}

          <div className={styles.goalsList}>
            {notebook?.goals?.length > 0 ? (
              notebook.goals.map(goal => (
                <div key={goal.id} className={styles.goalCard}>
                  <div className={styles.goalHeader}>
                    <h3 className={styles.goalTitle}>{goal.title}</h3>
                    <span className={`${styles.goalStatus} ${styles[`status${goal.status.replace(/\s+/g, '')}`]}`}>
                      {goal.status === 'Completado' ? <CheckCircle size={14} /> : <Circle size={14} />}
                      {goal.status}
                    </span>
                  </div>
                  {goal.description && <p className={styles.goalDescription}>{goal.description}</p>}
                  {goal.targetDate && (
                    <span className={styles.goalDate}>
                      <Calendar size={12} /> {formatDate(goal.targetDate)}
                    </span>
                  )}
                  <div className={styles.goalActions}>
                    <button className={styles.smallButton} onClick={() => setGoalForm({ open: true, title: goal.title, description: goal.description, status: goal.status, targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '', editingId: goal.id })}>
                      <Edit2 size={12} /> Editar
                    </button>
                    <button className={styles.smallButton} onClick={() => handleDeleteGoal(goal.id)}>
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <Target size={32} className={styles.emptyIcon} />
                <p>Sin objetivos</p>
              </div>
            )}
          </div>
        </section>

        {/* Assignments */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Tareas de práctica</h2>
            {!assignmentForm.open ? (
              <button className={styles.addButton} onClick={() => setAssignmentForm({ open: true, title: '', instructions: '', status: 'Pendiente', dueDate: '', editingId: null })}>
                <Plus size={16} /> Nueva
              </button>
            ) : null}
          </div>

          {assignmentForm.open && (
            <div className={styles.formCard}>
              <input
                className={styles.input}
                placeholder="Título de la tarea"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
              />
              <textarea
                className={styles.textarea}
                placeholder="Instrucciones (opcional)"
                value={assignmentForm.instructions}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, instructions: e.target.value }))}
                rows={3}
              />
              <div className={styles.formRow}>
                <select
                  className={styles.select}
                  value={assignmentForm.status}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  {ASSIGNMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  type="date"
                  className={styles.input}
                  value={assignmentForm.dueDate || ''}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => setAssignmentForm({ open: false, title: '', instructions: '', status: 'Pendiente', dueDate: '', editingId: null })}>
                  <X size={16} /> Cancelar
                </button>
                <button className={styles.saveButton} onClick={assignmentForm.editingId ? handleUpdateAssignment : handleAddAssignment}>
                  <Save size={16} /> {assignmentForm.editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          )}

          <div className={styles.assignmentsList}>
            {notebook?.assignments?.length > 0 ? (
              notebook.assignments.map(a => (
                <div key={a.id} className={styles.assignmentCard}>
                  <div className={styles.assignmentHeader}>
                    <h3 className={styles.assignmentTitle}>{a.title}</h3>
                    <span className={`${styles.assignmentStatus} ${styles[`status${a.status.replace(/\s+/g, '')}`]}`}>
                      {a.status === 'Completada' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {a.status}
                    </span>
                  </div>
                  {a.instructions && <p className={styles.assignmentInstructions}>{a.instructions}</p>}
                  {a.dueDate && (
                    <span className={styles.assignmentDate}>
                      <Calendar size={12} /> Vence: {formatDate(a.dueDate)}
                    </span>
                  )}
                  <div className={styles.goalActions}>
                    <button className={styles.smallButton} onClick={() => setAssignmentForm({ open: true, title: a.title, instructions: a.instructions, status: a.status, dueDate: a.dueDate ? a.dueDate.split('T')[0] : '', editingId: a.id })}>
                      <Edit2 size={12} /> Editar
                    </button>
                    <button className={styles.smallButton} onClick={() => handleDeleteAssignment(a.id)}>
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <ClipboardList size={32} className={styles.emptyIcon} />
                <p>Sin tareas</p>
              </div>
            )}
          </div>
        </section>

        {/* Assessment */}
        <section className={styles.section}>
          <h2>Valoración general</h2>
          <div className={styles.assessmentForm}>
            <div className={styles.assessmentGrid}>
              <div className={styles.assessmentItem}>
                <label>Compás</label>
                <select
                  className={styles.select}
                  value={assessmentForm.compas}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, compas: e.target.value }))}
                >
                  <option value="">Seleccionar</option>
                  {ASSESSMENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className={styles.assessmentItem}>
                <label>Coordinación</label>
                <select
                  className={styles.select}
                  value={assessmentForm.coordinacion}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, coordinacion: e.target.value }))}
                >
                  <option value="">Seleccionar</option>
                  {ASSESSMENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className={styles.assessmentItem}>
                <label>Técnica</label>
                <select
                  className={styles.select}
                  value={assessmentForm.tecnica}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, tecnica: e.target.value }))}
                >
                  <option value="">Seleccionar</option>
                  {ASSESSMENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className={styles.assessmentItem}>
                <label>Memoria coreográfica</label>
                <select
                  className={styles.select}
                  value={assessmentForm.memoria}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, memoria: e.target.value }))}
                >
                  <option value="">Seleccionar</option>
                  {ASSESSMENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className={styles.assessmentItem}>
                <label>Expresión</label>
                <select
                  className={styles.select}
                  value={assessmentForm.expresion}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, expresion: e.target.value }))}
                >
                  <option value="">Seleccionar</option>
                  {ASSESSMENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="Comentario general (opcional)"
              value={assessmentForm.comment}
              onChange={(e) => setAssessmentForm(prev => ({ ...prev, comment: e.target.value }))}
              rows={3}
            />
            <button className={styles.saveButton} onClick={handleSaveAssessment}>
              <Save size={16} /> Guardar valoración
            </button>
          </div>
        </section>

        {/* Next Review */}
        <section className={styles.section}>
          <h2>Próxima revisión</h2>
          <div className={styles.nextReviewForm}>
            <div className={styles.formRow}>
              <input
                type="date"
                className={styles.input}
                value={nextReviewForm.date}
                onChange={(e) => setNextReviewForm(prev => ({ ...prev, date: e.target.value }))}
              />
              <input
                className={styles.input}
                placeholder="Nota breve (opcional)"
                value={nextReviewForm.note}
                onChange={(e) => setNextReviewForm(prev => ({ ...prev, note: e.target.value }))}
              />
            </div>
            <button className={styles.saveButton} onClick={handleSaveNextReview}>
              <Save size={16} /> Guardar fecha
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherNotebookPage;