import { useTranslation } from '../i18n/i18n';
import styles from './BibliotecaPage.module.css';

const BibliotecaPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('navigation.library')}</h1>
      <p className={styles.description}>
        Tu biblioteca personal de ejercicios y prácticas.
      </p>
      <div className={styles.emptyState}>
        <p>Próximamente</p>
      </div>
    </div>
  );
};

export default BibliotecaPage;