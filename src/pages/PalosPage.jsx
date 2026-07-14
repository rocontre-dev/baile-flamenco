import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/i18n';
import styles from './PalosPage.module.css';

const PalosPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('navigation.palos')}</h1>
      <p className={styles.description}>
        Explora los diferentes palos del flamenco y comienza tu aprendizaje.
      </p>
      <div className={styles.grid}>
        <Link to="/alumno/palos/tangos" className={styles.card}>
          <h2 className={styles.cardTitle}>Tangos</h2>
          <p className={styles.cardDescription}>
            Palo flamenco de compás binario (4/4), de aire alegre y festivo.
          </p>
          <span className={styles.cardBadge}>5 categorías</span>
        </Link>
        <div className={`${styles.card} ${styles.cardDisabled}`}>
          <h2 className={styles.cardTitle}>Alegrías</h2>
          <p className={styles.cardDescription}>Próximamente</p>
        </div>
        <div className={`${styles.card} ${styles.cardDisabled}`}>
          <h2 className={styles.cardTitle}>Bulerías</h2>
          <p className={styles.cardDescription}>Próximamente</p>
        </div>
        <div className={`${styles.card} ${styles.cardDisabled}`}>
          <h2 className={styles.cardTitle}>Soleá</h2>
          <p className={styles.cardDescription}>Próximamente</p>
        </div>
      </div>
    </div>
  );
};

export default PalosPage;