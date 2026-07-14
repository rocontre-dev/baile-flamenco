import { useTranslation } from '../../i18n/i18n';
import styles from '../academy/AcademyPages.module.css';

/**
 * Admin Settings Page
 * Placeholder for future configuration functionality
 */
const AdminSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('admin.settings')}</h1>
        <p className={styles.pageSubtitle}>
          Configuración de la academia
        </p>
      </div>

      <div className={styles.emptyState}>
        <p>Esta sección estará disponible próximamente.</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-md)' }}>
          This section will be available soon.
        </p>
      </div>
    </div>
  );
};

export default AdminSettingsPage;