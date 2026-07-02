import { useTranslation } from '../../i18n/i18n';
import { useApp } from '../../context/AppContext';
import NavigationTree from '../navigation/NavigationTree';
import styles from './Sidebar.module.css';

/**
 * Sidebar component for navigation
 * Fixed on the left side of the page
 * Uses NavigationTree for scalable navigation
 */
const Sidebar = () => {
  const { sidebarOpen } = useApp();
  const { t } = useTranslation();

  // Build navigation tree data structure
  const navigationNodes = [
    {
      id: 'palo-001',
      name: 'Tangos',
      path: '/palos/tangos',
      isDefaultExpanded: true,
      disabled: false,
      children: [
        { id: 'cat-001', name: t('sidebar.compas'), path: '/palos/tangos/compas' },
        { id: 'cat-002', name: t('sidebar.marcajes'), path: '/palos/tangos/marcajes' },
        { id: 'cat-003', name: t('sidebar.tablasPies'), path: '/palos/tangos/tablas-pies' },
        { id: 'cat-004', name: t('sidebar.remates'), path: '/palos/tangos/remates' },
        { id: 'cat-005', name: t('sidebar.llamadas'), path: '/palos/tangos/llamadas' },
      ]
    },
    {
      id: 'palo-002',
      name: 'Alegrías',
      path: '/palos/alegrias',
      isDefaultExpanded: false,
      disabled: true,
      children: []
    },
    {
      id: 'palo-003',
      name: 'Bulerías',
      path: '/palos/bulerias',
      isDefaultExpanded: false,
      disabled: true,
      children: []
    },
    {
      id: 'palo-004',
      name: 'Soleá',
      path: '/palos/solea',
      isDefaultExpanded: false,
      disabled: true,
      children: []
    },
  ];

  return (
    <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.collapsed : ''}`}>
      <div className={styles.container}>
        {/* Title */}
        <h2 className={styles.title}>{t('sidebar.title')}</h2>

        {/* Navigation Tree */}
        <NavigationTree nodes={navigationNodes} />

        {/* Bottom card */}
        <div className={styles.bottomCard}>
          <p className={styles.quote}>{t('sidebar.practiceMakesMaster')}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;