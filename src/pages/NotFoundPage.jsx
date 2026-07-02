import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/i18n';
import Button from '../components/common/Button';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>{t('errors.notFound')}</h2>
        <p className={styles.description}>
          La página que buscas no existe o ha sido movida.
        </p>
        <div className={styles.actions}>
          <Link to="/">
            <Button variant="primary">{t('errors.goHome')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;