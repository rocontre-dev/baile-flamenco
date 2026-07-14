/**
 * Teacher Notebook Repository
 * Manages persistence of teacher notebook data in localStorage
 * Handles authorization, corruption, and data isolation
 */

const STORAGE_KEY = 'tibiritabara.teacherNotebook.v1';

/**
 * Default notebook structure
 */
const createEmptyNotebook = () => ({
  observations: [],
  goals: [],
  assignments: [],
  assessment: null,
  nextReview: null,
});

/**
 * Generate unique ID
 */
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Safely parse stored data
 */
const parseStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Validate structure
    if (!parsed || typeof parsed !== 'object' || parsed.version !== 1 || !parsed.notebooks) {
      console.warn('Invalid notebook data structure, using defaults');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing notebook data:', error);
    return null;
  }
};

/**
 * Safely save data
 */
const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving notebook data:', error);
    return false;
  }
};

/**
 * Get notebook key
 */
const getNotebookKey = (teacherId, studentId) => `${teacherId}:${studentId}`;

class TeacherNotebookRepository {
  /**
   * Get notebook for a teacher-student pair
   * @param {string} teacherId
   * @param {string} studentId
   * @returns {Object} Notebook data
   */
  getNotebook(teacherId, studentId) {
    if (!teacherId || !studentId) {
      return createEmptyNotebook();
    }

    const data = parseStoredData();
    if (!data) {
      return createEmptyNotebook();
    }

    const key = getNotebookKey(teacherId, studentId);
    return data.notebooks[key] || createEmptyNotebook();
  }

  /**
   * Add observation
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} text
   * @param {string} [courseId]
   * @returns {Object|null} Created observation or null if error
   */
  addObservation(teacherId, studentId, text, courseId = null) {
    if (!teacherId || !studentId || !text || text.trim().length < 3) {
      return null;
    }

    const data = parseStoredData() || { version: 1, notebooks: {} };
    const key = getNotebookKey(teacherId, studentId);

    if (!data.notebooks[key]) {
      data.notebooks[key] = createEmptyNotebook();
    }

    const observation = {
      id: generateId(),
      studentId,
      teacherId,
      text: text.trim(),
      courseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.notebooks[key].observations.push(observation);

    if (!saveStoredData(data)) {
      return null;
    }

    return observation;
  }

  /**
   * Update observation
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} observationId
   * @param {string} text
   * @returns {Object|null} Updated observation or null if error
   */
  updateObservation(teacherId, studentId, observationId, text) {
    if (!teacherId || !studentId || !observationId || !text || text.trim().length < 3) {
      return null;
    }

    const data = parseStoredData();
    if (!data) return null;

    const key = getNotebookKey(teacherId, studentId);
    const notebook = data.notebooks[key];
    if (!notebook) return null;

    const index = notebook.observations.findIndex(
      obs => obs.id === observationId && obs.teacherId === teacherId && obs.studentId === studentId
    );

    if (index === -1) return null;

    notebook.observations[index].text = text.trim();
    notebook.observations[index].updatedAt = new Date().toISOString();

    if (!saveStoredData(data)) {
      return null;
    }

    return notebook.observations[index];
  }

  /**
   * Delete observation
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} observationId
   * @returns {boolean}
   */
  deleteObservation(teacherId, studentId, observationId) {
    if (!teacherId || !studentId || !observationId) {
      return false;
    }

    const data = parseStoredData();
    if (!data) return false;

    const key = getNotebookKey(teacherId, studentId);
    const notebook = data.notebooks[key];
    if (!notebook) return false;

    const index = notebook.observations.findIndex(
      obs => obs.id === observationId && obs.teacherId === teacherId && obs.studentId === studentId
    );

    if (index === -1) return false;

    notebook.observations.splice(index, 1);

    return saveStoredData(data);
  }

  /**
   * Add goal
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} title
   * @param {string} description
   * @param {string} status
   * @param {string} [courseId]
   * @param {string} [targetDate]
   * @returns {Object|null} Created goal or null if error
   */
  addGoal(teacherId, studentId, title, description, status, courseId = null, targetDate = null) {
    if (!teacherId || !studentId || !title || !status) {
      return null;
    }

    const validStatuses = ['Pendiente', 'En progreso', 'Completado'];
    if (!validStatuses.includes(status)) {
      return null;
    }

    if (targetDate && isNaN(new Date(targetDate).getTime())) {
      return null;
    }

    const data = parseStoredData() || { version: 1, notebooks: {} };
    const key = getNotebookKey(teacherId, studentId);

    if (!data.notebooks[key]) {
      data.notebooks[key] = createEmptyNotebook();
    }

    const goal = {
      id: generateId(),
      studentId,
      teacherId,
      title: title.trim(),
      description: description ? description.trim() : '',
      status,
      courseId,
      targetDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.notebooks[key].goals.push(goal);

    if (!saveStoredData(data)) {
      return null;
    }

    return goal;
  }

  /**
   * Update goal
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} goalId
   * @param {string} title
   * @param {string} description
   * @param {string} status
   * @param {string} [courseId]
   * @param {string} [targetDate]
   * @returns {Object|null} Updated goal or null if error
   */
  updateGoal(teacherId, studentId, goalId, title, description, status, courseId = null, targetDate = null) {
    if (!teacherId || !studentId || !goalId || !title || !status) {
      return null;
    }

    const validStatuses = ['Pendiente', 'En progreso', 'Completado'];
    if (!validStatuses.includes(status)) {
      return null;
    }

    if (targetDate && isNaN(new Date(targetDate).getTime())) {
      return null;
    }

    const data = parseStoredData();
    if (!data) return null;

    const key = getNotebookKey(teacherId, studentId);
    const notebook = data.notebooks[key];
    if (!notebook) return null;

    const index = notebook.goals.findIndex(
      g => g.id === goalId && g.teacherId === teacherId && g.studentId === studentId
    );

    if (index === -1) return null;

    notebook.goals[index] = {
      ...notebook.goals[index],
      title: title.trim(),
      description: description ? description.trim() : '',
      status,
      courseId,
      targetDate,
      updatedAt: new Date().toISOString(),
    };

    if (!saveStoredData(data)) {
      return null;
    }

    return notebook.goals[index];
  }

  /**
   * Delete goal
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} goalId
   * @returns {boolean}
   */
  deleteGoal(teacherId, studentId, goalId) {
    if (!teacherId || !studentId || !goalId) {
      return false;
    }

    const data = parseStoredData();
    if (!data) return false;

    const key = getNotebookKey(teacherId, studentId);
    const notebook = data.notebooks[key];
    if (!notebook) return false;

    const index = notebook.goals.findIndex(
      g => g.id === goalId && g.teacherId === teacherId && g.studentId === studentId
    );

    if (index === -1) return false;

    notebook.goals.splice(index, 1);

    return saveStoredData(data);
  }

  /**
   * Add assignment
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} title
   * @param {string} instructions
   * @param {string} status
   * @param {string} [courseId]
   * @param {string} [lessonId]
   * @param {string} [dueDate]
   * @returns {Object|null} Created assignment or null if error
   */
  addAssignment(teacherId, studentId, title, instructions, status, courseId = null, lessonId = null, dueDate = null) {
    if (!teacherId || !studentId || !title || !status) {
      return null;
    }

    const validStatuses = ['Pendiente', 'En progreso', 'Completada'];
    if (!validStatuses.includes(status)) {
      return null;
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return null;
    }

    const data = parseStoredData() || { version: 1, notebooks: {} };
    const key = getNotebookKey(teacherId, studentId);

    if (!data.notebooks[key]) {
      data.notebooks[key] = createEmptyNotebook();
    }

    const assignment = {
      id: generateId(),
      studentId,
      teacherId,
      title: title.trim(),
      instructions: instructions ? instructions.trim() : '',
      status,
      courseId,
      lessonId,
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.notebooks[key].assignments.push(assignment);

    if (!saveStoredData(data)) {
      return null;
    }

    return assignment;
  }

  /**
   * Update assignment
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} assignmentId
   * @param {string} title
   * @param {string} instructions
   * @param {string} status
   * @param {string} [courseId]
   * @param {string} [lessonId]
   * @param {string} [dueDate]
   * @returns {Object|null} Updated assignment or null if error
   */
  updateAssignment(teacherId, studentId, assignmentId, title, instructions, status, courseId = null, lessonId = null, dueDate = null) {
    if (!teacherId || !studentId || !assignmentId || !title || !status) {
      return null;
    }

    const validStatuses = ['Pendiente', 'En progreso', 'Completada'];
    if (!validStatuses.includes(status)) {
      return null;
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return null;
    }

    const data = parseStoredData();
    if (!data) return null;

    const key = getNotebookKey(teacherId, studentId);
    const notebook = data.notebooks[key];
    if (!notebook) return null;

    const index = notebook.assignments.findIndex(
      a => a.id === assignmentId && a.teacherId === teacherId && a.studentId === studentId
    );

    if (index === -1) return null;

    notebook.assignments[index] = {
      ...notebook.assignments[index],
      title: title.trim(),
      instructions: instructions ? instructions.trim() : '',
      status,
      courseId,
      lessonId,
      dueDate,
      updatedAt: new Date().toISOString(),
    };

    if (!saveStoredData(data)) {
      return null;
    }

    return notebook.assignments[index];
  }

  /**
   * Delete assignment
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} assignmentId
   * @returns {boolean}
   */
  deleteAssignment(teacherId, studentId, assignmentId) {
    if (!teacherId || !studentId || !assignmentId) {
      return false;
    }

    const data = parseStoredData();
    if (!data) return false;

    const key = getNotebookKey(teacherId, studentId);
    const notebook = data.notebooks[key];
    if (!notebook) return false;

    const index = notebook.assignments.findIndex(
      a => a.id === assignmentId && a.teacherId === teacherId && a.studentId === studentId
    );

    if (index === -1) return false;

    notebook.assignments.splice(index, 1);

    return saveStoredData(data);
  }

  /**
   * Save assessment
   * @param {string} teacherId
   * @param {string} studentId
   * @param {Object} assessment
   * @returns {Object|null} Saved assessment or null if error
   */
  saveAssessment(teacherId, studentId, assessment) {
    if (!teacherId || !studentId || !assessment) {
      return null;
    }

    const validLevels = ['Inicial', 'En desarrollo', 'Adecuado', 'Sólido', 'Destacado'];

    const requiredCriteria = ['compas', 'coordinacion', 'tecnica', 'memoria', 'expresion'];
    for (const criterion of requiredCriteria) {
      if (!assessment[criterion] || !validLevels.includes(assessment[criterion])) {
        return null;
      }
    }

    const data = parseStoredData() || { version: 1, notebooks: {} };
    const key = getNotebookKey(teacherId, studentId);

    if (!data.notebooks[key]) {
      data.notebooks[key] = createEmptyNotebook();
    }

    const savedAssessment = {
      studentId,
      teacherId,
      compas: assessment.compas,
      coordinacion: assessment.coordinacion,
      tecnica: assessment.tecnica,
      memoria: assessment.memoria,
      expresion: assessment.expresion,
      comment: assessment.comment ? assessment.comment.trim() : '',
      updatedAt: new Date().toISOString(),
    };

    data.notebooks[key].assessment = savedAssessment;

    if (!saveStoredData(data)) {
      return null;
    }

    return savedAssessment;
  }

  /**
   * Save next review
   * @param {string} teacherId
   * @param {string} studentId
   * @param {string} date
   * @param {string} [note]
   * @returns {Object|null} Saved next review or null if error
   */
  saveNextReview(teacherId, studentId, date, note = '') {
    if (!teacherId || !studentId || !date || isNaN(new Date(date).getTime())) {
      return null;
    }

    const data = parseStoredData() || { version: 1, notebooks: {} };
    const key = getNotebookKey(teacherId, studentId);

    if (!data.notebooks[key]) {
      data.notebooks[key] = createEmptyNotebook();
    }

    const nextReview = {
      studentId,
      teacherId,
      date,
      note: note ? note.trim() : '',
      updatedAt: new Date().toISOString(),
    };

    data.notebooks[key].nextReview = nextReview;

    if (!saveStoredData(data)) {
      return null;
    }

    return nextReview;
  }
}

export default new TeacherNotebookRepository();