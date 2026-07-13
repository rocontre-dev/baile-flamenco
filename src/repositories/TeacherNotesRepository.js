import { mockTeacherNotes } from '../data/mockTeacherNotes';

/**
 * Teacher Notes Repository
 * Manages teacher notes data operations (mock only - no backend)
 */
class TeacherNotesRepository {
  /**
   * Get all notes for a specific student
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} List of notes for the student
   */
  async getByStudent(studentId) {
    return mockTeacherNotes
      .filter(note => note.studentId === studentId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  }

  /**
   * Get a note by ID
   * @param {string} id - Note ID
   * @returns {Promise<Object|null>} Note data or null if not found
   */
  async getById(id) {
    const note = mockTeacherNotes.find(n => n.id === id);
    return note || null;
  }

  /**
   * Add a new note (in-memory only - no persistence)
   * @param {Object} note - Note data to add
   * @returns {Promise<Object>} The added note
   */
  async add(note) {
    mockTeacherNotes.push(note);
    return note;
  }

  /**
   * Update an existing note (in-memory only - no persistence)
   * @param {Object} note - Updated note data
   * @returns {Promise<Object|null>} Updated note or null if not found
   */
  async update(note) {
    const index = mockTeacherNotes.findIndex(n => n.id === note.id);
    if (index !== -1) {
      mockTeacherNotes[index] = { ...mockTeacherNotes[index], ...note };
      return mockTeacherNotes[index];
    }
    return null;
  }

  /**
   * Delete a note (in-memory only - no persistence)
   * @param {string} id - Note ID to delete
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    const index = mockTeacherNotes.findIndex(n => n.id === id);
    if (index !== -1) {
      mockTeacherNotes.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get notes by teacher ID
   * @param {string} teacherId - Teacher ID
   * @returns {Promise<Array>} List of notes by the teacher
   */
  async getByTeacher(teacherId) {
    return mockTeacherNotes
      .filter(note => note.teacherId === teacherId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export default new TeacherNotesRepository();