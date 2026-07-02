import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/i18n';
import styles from './HomePage.module.css';

/**
 * Home page
 * Landing page for the platform
 */
const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* Hero section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Tibiritábara</h1>
        <p className={styles.subtitle}>{t('home.subtitle')}</p>
        <Link to="/palos" className={styles.ctaButton}>
          {t('home.startLearning')}
        </Link>
      </section>

      {/* Featured content */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('home.featuredCourses')}</h2>
        <div className={styles.cards}>
          <Link to="/palos/tangos" className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Tangos</h3>
              <p className={styles.cardDescription}>
                Aprende los fundamentos del tango flamenco: compás, marcajes, remates y llamadas.
              </p>
              <span className={styles.cardLevel}>Principiante</span>
            </div>
          </Link>
          
          <div className={`${styles.card} ${styles.cardDisabled}`}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Alegrías</h3>
              <p className={styles.cardDescription}>
                Próximamente
              </p>
              <span className={styles.cardLevel}>Intermedio</span>
            </div>
          </div>
          
          <div className={`${styles.card} ${styles.cardDisabled}`}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Bulerías</h3>
              <p className={styles.cardDescription}>
                Próximamente
              </p>
              <span className={styles.cardLevel}>Avanzado</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;