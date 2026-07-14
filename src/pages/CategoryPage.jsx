import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GetExercise from '../useCases/exercises/GetExercise';
import Breadcrumb from '../components/navigation/Breadcrumb';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
  const { paloSlug, categoriaSlug } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // This would normally fetch by category, but for now we'll show the one exercise
  useEffect(() => {
    const loadExercises = async () => {
      try {
        // For demo purposes, load the single exercise we have
        const exercise = await GetExercise.execute('remate-basico');
        setExercises([exercise]);
      } catch (err) {
        console.error('Error loading exercises:', err);
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, []);

  if (loading) return <div className={styles.container}>Cargando...</div>;

  return (
    <div className={styles.container}>
      <Breadcrumb items={[
        { to: '/alumno/palos', label: 'Palos' },
        { to: `/alumno/palos/${paloSlug}`, label: paloSlug },
        { to: '', label: categoriaSlug }
      ]} />
      
      <h1 className={styles.title}>{categoriaSlug}</h1>
      
      <div className={styles.exercises}>
        {exercises.map(exercise => (
          <Link 
            key={exercise.id}
            to={`/alumno/palos/${paloSlug}/${categoriaSlug}/${exercise.slug}`}
            className={styles.exerciseCard}
          >
            <h2 className={styles.exerciseTitle}>{exercise.titulo}</h2>
            <p className={styles.exerciseDescription}>{exercise.descripcion}</p>
            <div className={styles.exerciseMeta}>
              <span className={styles.level}>{exercise.nivel}</span>
              <span className={styles.duration}>{exercise.duracion}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;