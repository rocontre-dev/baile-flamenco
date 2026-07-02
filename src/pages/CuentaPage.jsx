import { useTranslation } from '../i18n/i18n';
import styles from './CuentaPage.module.css';

const CuentaPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('navigation.account')}</h1>
      <div className={styles.content}>
        <div className={styles.loginForm}>
          <h2>{t('auth.signIn')}</h2>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="email">{t('auth.email')}</label>
              <input type="email" id="email" placeholder="tu@email.com" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">{t('auth.password')}</label>
              <input type="password" id="password" placeholder="••••••••" />
            </div>
            <button type="submit" className={styles.submitButton}>
              {t('auth.signIn')}
            </button>
          </form>
          <p className={styles.registerLink}>
            {t('auth.noAccount')} <a href="#">{t('auth.register')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CuentaPage;