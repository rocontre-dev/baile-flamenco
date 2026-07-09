import { useAuth } from '../../context/AuthContext';
import styles from './DemoRoleSwitcher.module.css';

/**
 * DemoRoleSwitcher Component
 * Allows switching between demo roles for presentation purposes.
 * Stores selection in localStorage to persist across reloads.
 */
const DemoRoleSwitcher = () => {
  const { user, switchRole, hasRole } = useAuth();

  const handleChange = (e) => {
    const newRole = e.target.value;
    switchRole(newRole);
  };

  const getRoleLabel = () => {
    if (!user) return 'No user';
    const labels = {
      admin: 'Admin',
      teacher: 'Profesor',
      student: 'Alumno'
    };
    return labels[user.role] || user.role;
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="demo-role-select">
        Demo:
      </label>
      <select
        id="demo-role-select"
        className={styles.select}
        value={user?.role || ''}
        onChange={handleChange}
      >
        <option value="admin">Admin</option>
        <option value="teacher">Profesor</option>
        <option value="student">Alumno</option>
      </select>
      <span className={styles.userName}>
        {user?.name || ''}
      </span>
    </div>
  );
};

export default DemoRoleSwitcher;