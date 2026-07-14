import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from '../config/roles';
import { useAuth } from '../context/AuthContext';
import styles from './ProfileSelectionPage.module.css';

/**
 * Pantalla de selección de perfil
 * Permite al usuario elegir el rol con el que desea ingresar a la aplicación
 */
const ProfileSelectionPage = () => {
  const navigate = useNavigate();
  const { selectRole } = useAuth();

  const profiles = [
    {
      role: ROLES.ADMIN,
      icon: GraduationCap,
      label: ROLE_LABELS[ROLES.ADMIN],
      description: ROLE_DESCRIPTIONS[ROLES.ADMIN],
    },
    {
      role: ROLES.TEACHER,
      icon: Users,
      label: ROLE_LABELS[ROLES.TEACHER],
      description: ROLE_DESCRIPTIONS[ROLES.TEACHER],
    },
    {
      role: ROLES.STUDENT,
      icon: BookOpen,
      label: ROLE_LABELS[ROLES.STUDENT],
      description: ROLE_DESCRIPTIONS[ROLES.STUDENT],
    },
  ];

  const handleSelectProfile = (role) => {
    // Select role and set user in context
    selectRole(role);
    
    // Navigate to the corresponding area
    const routes = {
      [ROLES.ADMIN]: '/administrador',
      [ROLES.TEACHER]: '/profesor',
      [ROLES.STUDENT]: '/alumno',
    };
    
    navigate(routes[role]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Tibirítábara</h1>
          <p className={styles.subtitle}>Selecciona tu perfil</p>
        </header>

        <div className={styles.profilesGrid}>
          {profiles.map((profile) => (
            <button
              key={profile.role}
              className={styles.profileCard}
              onClick={() => handleSelectProfile(profile.role)}
              aria-label={`Entrar como ${profile.label}`}
            >
              <div className={styles.iconWrapper}>
                <profile.icon size={48} className={styles.icon} />
              </div>
              <h2 className={styles.profileLabel}>{profile.label}</h2>
              <p className={styles.profileDescription}>{profile.description}</p>
            </button>
          ))}
        </div>

        <footer className={styles.footer}>
          <p>Aplicación de práctica de baile flamenco</p>
        </footer>
      </div>
    </div>
  );
};

export default ProfileSelectionPage;