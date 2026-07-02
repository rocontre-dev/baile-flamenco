import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GetPalo from '../useCases/palos/GetPalo';
import Breadcrumb from '../components/navigation/Breadcrumb';
import styles from './PaloDetailPage.module.css';

const PaloDetailPage = () => {
  const { paloSlug } = useParams();
  const [palo, setPalo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPalo = async () => {
      try {
        const data = await GetPalo.execute(paloSlug);
        setPalo(data);
      } catch (err) {
        console.error('Error loading palo:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPalo();
  }, [paloSlug]);

  if (loading) return <div className={styles.container}>Cargando...</div>;
  if (!palo) return <div className={styles.container}>Palo no encontrado</div>;

  return (
    <div className={styles.container}>
      <Breadcrumb items={[
        { to: '/palos', label: 'Palos' },
        { to: '', label: palo.nombre }
      ]} />
      
      <h1 className={styles.title}>{palo.nombre}</h1>
      <p className={styles.description}>{palo.descripcion}</p>
      
      <div className={styles.categories}>
        <h2 className={styles.sectionTitle}>Categorías</h2>
        {palo.categorias?.map(cat => (
          <Link 
            key={cat.id} 
            to={`/palos/${paloSlug}/${cat.slug}`}
            className={styles.categoryCard}
          >
            <h3 className={styles.categoryName}>{cat.nombre}</h3>
            <p className={styles.categoryDescription}>{cat.descripcion}</p>
            <span className={styles.categoryCount}>
              {cat.ejerciciosCount || 0} ejercicios
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PaloDetailPage;