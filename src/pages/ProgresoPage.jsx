import { useTranslation } from '../i18n/i18n';
import styles from './ProgresoPage.module.css';

const ProgresoPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('navigation.progress')}</h1>
      <p className={styles.description}>
        Sigue tu progreso de aprendizaje.
      </p>
      <div className={styles.emptyState}>
        <p>Próximamente</p>
      </div>
    </div>
  );
};

export default ProgresoPage;