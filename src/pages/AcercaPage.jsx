import { useTranslation } from '../i18n/i18n';
import styles from './AcercaPage.module.css';

const AcercaPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('navigation.about')}</h1>
      <div className={styles.content}>
        <h2>Tibiritábara</h2>
        <p>
          Plataforma de aprendizaje de baile flamenco dirigida por Rodrigo Robles.
          Nuestro objetivo es preservar y enseñar el arte del flamenco de manera
          profesional y accesible.
        </p>
        <h3>Nuestra Filosofía</h3>
        <p>
          Creemos que la práctica constante y el entendimiento profundo del compás
          son fundamentales para el aprendizaje del baile flamenco. Cada ejercicio
          está diseñado para desarrollar técnica, musicalidad y expresión artística.
        </p>
      </div>
    </div>
  );
};

export default AcercaPage;