import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, Headphones, Eye, ListOrdered, Lightbulb, AlertTriangle, RefreshCw, ChevronRight } from 'lucide-react';
import GetExercise from '../useCases/exercises/GetExercise';
import BeatCounter from '../components/media/BeatCounter';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Button from '../components/common/Button';
import { useTranslation } from '../i18n/i18n';
import styles from './LessonPage.module.css';

/**
 * Lesson page - displays a complete exercise lesson
 * Reorganized with clear sections following the Tibiritábara methodology
 */
const LessonPage = () => {
  const { paloSlug, categoriaSlug, ejercicioSlug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);
        const data = await GetExercise.execute(ejercicioSlug);
        setExercise(data);
        setError(null);
      } catch (err) {
        console.error('Error loading exercise:', err);
        setError('Ejercicio no encontrado');
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [ejercicioSlug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error || 'Ejercicio no encontrado'}</p>
          <Link to="/palos">
            <Button variant="primary">Volver a Palos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { to: '/palos', label: 'Palos' },
    { to: `/palos/${paloSlug}`, label: exercise.palo?.nombre || paloSlug },
    { to: `/palos/${paloSlug}/${categoriaSlug}`, label: exercise.categoria?.nombre || categoriaSlug },
    { to: '', label: exercise.titulo }
  ];

  const handleAudioToggle = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // Aquí iría la lógica real de reproducción de audio
  };

  const getNextExercise = () => {
    // Lógica para obtener el siguiente ejercicio (placeholder)
    return `/palos/${paloSlug}/${categoriaSlug}`;
  };

  return (
    <div className={styles.container}>
      {/* ===== 1. ENCABEZADO DE LECCIÓN ===== */}
      <header className={styles.lessonHeader}>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className={styles.headerContent}>
          <div className={styles.headerBadges}>
            <span className={`${styles.badge} ${styles.badgeLevel}`}>
              {exercise.nivel || 'Principiante'}
            </span>
            {exercise.duracion && (
              <span className={`${styles.badge} ${styles.badgeDuration}`}>
                ⏱ {exercise.duracion} min
              </span>
            )}
          </div>
          
          <h1 className={styles.title}>{exercise.titulo}</h1>
          {exercise.subtitulo && (
            <p className={styles.subtitle}>{exercise.subtitulo}</p>
          )}
          
          {exercise.profesor?.nombre && (
            <p className={styles.profesor}>
              👤 {exercise.profesor.titulo || 'Profesor'}: {exercise.profesor.nombre}
            </p>
          )}
        </div>
      </header>

      {/* ===== 2. ESCUCHA EL COMPÁS ===== */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <Headphones size={24} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Escucha el compás</h2>
          </div>
          
          <p className={styles.sectionDescription}>
            Antes de observar el movimiento, familiarízate con el ritmo de los {exercise.palo?.nombre ? exercise.palo.nombre.toLowerCase() : 'este palo'}.
          </p>
          
          <div className={styles.audioControls}>
            <button 
              className={styles.audioButton}
              onClick={handleAudioToggle}
              aria-label={isAudioPlaying ? 'Pausar audio' : 'Reproducir audio'}
            >
              {isAudioPlaying ? <Pause size={24} /> : <Play size={24} />}
              <span>{isAudioPlaying ? 'Pausar' : 'Reproducir'}</span>
            </button>
            
            <button 
              className={styles.audioButtonSecondary}
              aria-label="Repetir audio"
            >
              <RotateCcw size={18} />
              <span>Repetir</span>
            </button>
          </div>
          
          <div className={styles.audioInfo}>
            <span>Compás: {exercise.palo?.compas}/4</span>
            <span>Tempo: ~{exercise.palo?.tempo || '120'} BPM</span>
          </div>
        </div>
      </section>

      {/* ===== 3. OBSERVA EL MOVIMIENTO ===== */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <Eye size={24} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Observa el movimiento</h2>
          </div>
          
          {/* Video */}
          <div className={styles.videoContainer}>
            <div className={styles.videoPlaceholder}>
              <Play size={48} />
              <p>Video: {exercise.recursos?.video?.principal || 'No disponible'}</p>
              <p className={styles.videoNote}>Placeholder - El video se implementará con los assets reales</p>
            </div>
          </div>
          
          {/* BeatCounter integrado */}
          <div className={styles.beatCounterWrapper}>
            <h3 className={styles.subsectionTitle}>Compás</h3>
            <BeatCounter
              beats={exercise.contenido?.conteo && exercise.contenido.conteo.length > 0 ? exercise.contenido.conteo : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              currentBeat={currentBeat}
              accentBeats={exercise.palo?.acentos && exercise.palo.acentos.length > 0 ? exercise.palo.acentos : [1, 3, 5, 7, 9, 11]}
              onBeatClick={setCurrentBeat}
            />
          </div>
          
          {/* Miniaturas */}
          {exercise.recursos?.imagen?.miniaturas && (
            <div className={styles.thumbnailSection}>
              <h3 className={styles.subsectionTitle}>Vista frontal</h3>
              <div className={styles.thumbnailStrip}>
                {exercise.recursos.imagen.miniaturas.map((thumb, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${selectedThumbnail === index ? styles.active : ''}`}
                    onClick={() => setSelectedThumbnail(index)}
                    aria-label={`Miniatura ${index + 1}`}
                  >
                    <span className={styles.thumbnailPlaceholder}>
                      {index + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== 4. CÓMO SE REALIZA ===== */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <ListOrdered size={24} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Cómo se realiza</h2>
          </div>
          
          <p className={styles.description}>{exercise.descripcion || 'Descripción no disponible.'}</p>
          
          {exercise.contenido?.pasos && exercise.contenido.pasos.length > 0 ? (
          <div className={styles.steps}>
            {exercise.contenido.pasos.map((paso, index) => (
              <div key={index} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <div className={styles.stepContent}>
                  {paso.tiempos && (
                    <h4 className={styles.stepTimes}>{paso.tiempos}</h4>
                  )}
                  <p className={styles.stepDescription}>{paso.descripcion}</p>
                  {paso.detalles && (
                    <ul className={styles.stepDetails}>
                      {paso.detalles.map((detalle, i) => (
                        <li key={i}>{detalle}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
          ) : null}
        </div>
      </section>

      {/* ===== 5. CONSEJOS DEL PROFESOR ===== */}
      {exercise.contenido?.consejos && Array.isArray(exercise.contenido.consejos) && exercise.contenido.consejos.length > 0 && (
        <section className={styles.section}>
          <div className={`${styles.sectionCard} ${styles.tipsCard}`}>
            <div className={styles.sectionHeader}>
              <Lightbulb size={24} className={`${styles.sectionIcon} ${styles.tipsIcon}`} />
              <h2 className={styles.sectionTitle}>Consejos del profesor</h2>
            </div>
            
            <ul className={styles.tipsList}>
              {exercise.contenido.consejos.map((consejo, index) => (
                <li key={index}>
                  <span className={styles.tipBullet}>→</span>
                  {consejo}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===== 6. ERRORES COMUNES ===== */}
      <section className={styles.section}>
        <div className={`${styles.sectionCard} ${styles.mistakesCard}`}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={24} className={`${styles.sectionIcon} ${styles.mistakesIcon}`} />
            <h2 className={styles.sectionTitle}>Errores comunes</h2>
          </div>
          
          <ul className={styles.mistakesList}>
            <li>Perder el compás en el último tiempo.</li>
            <li>Bajar la mirada durante el giro.</li>
            <li>Tensar demasiado el braceo.</li>
          </ul>
          
          <p className={styles.mistakesNote}>
            Presta atención a estos puntos para evitar vicios en tu técnica.
          </p>
        </div>
      </section>

      {/* ===== 7. REPITE EL EJERCICIO ===== */}
      <section className={styles.section}>
        <div className={`${styles.sectionCard} ${styles.practiceCard}`}>
          <div className={styles.practiceContent}>
            <RefreshCw size={32} className={styles.practiceIcon} />
            
            <h2 className={styles.practiceTitle}>¡A practicar!</h2>
            
            <p className={styles.practiceDescription}>
              Repite este ejercicio varias veces hasta sentir el compás de forma natural.
              La constancia es la clave del flamenco.
            </p>
            
            <div className={styles.practiceActions}>
              <Button 
                variant="secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Play size={16} />
                Volver a reproducir
              </Button>
              
              <Button 
                variant="primary"
                onClick={() => navigate(getNextExercise())}
              >
                Siguiente lección
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LessonPage;