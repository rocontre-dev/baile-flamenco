import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, Headphones, Eye, ListOrdered, Lightbulb, AlertTriangle, RefreshCw, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import GetExercise from '../useCases/exercises/GetExercise';
import BeatCounter from '../components/media/BeatCounter';
import PracticePlayer from '../components/media/PracticePlayer';
import { formatSecondsToDuration, generateId } from '../utils/helpers';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Button from '../components/common/Button';
import styles from './LessonPage.module.css';

/**
 * Lesson page - displays a complete exercise lesson
 * Reorganized with clear sections following the Tibiritábara methodology
 */
const LessonPage = () => {
  const { paloSlug, categoriaSlug, ejercicioSlug } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [practiceNotes, setPracticeNotes] = useState('');
  const playerRef = useRef(null);

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

  // Helper: Get video URL from new resource structure
  // Resuelve la versión principal del video desde la nueva estructura de versiones
  const getVideoSrc = () => {
    const videoConfig = exercise.recursos?.video;
    if (!videoConfig) return '';
    
    // Nueva estructura con versiones
    if (videoConfig.versiones && videoConfig.principal) {
      const versionPrincipal = videoConfig.versiones.find(v => v.id === videoConfig.principal);
      if (versionPrincipal) {
        return `/videos/${versionPrincipal.archivo}`;
      }
    }
    
    // Estructura antigua (compatibilidad)
    if (videoConfig.principal && typeof videoConfig.principal === 'string') {
      return `/videos/${videoConfig.principal}`;
    }
    
    return '';
  };

  // Helper: Get markers from practiceData or fallback to empty array
  const getMarkers = () => {
    // Nueva estructura desde practiceData
    if (exercise.practiceData?.marcadoresSugeridos) {
      return exercise.practiceData.marcadoresSugeridos.map(m => ({
        id: m.id,
        label: m.label,
        time: m.tiempo
      }));
    }
    return [];
  };

  // Helper: Get beats from practiceData or fallback to contenido.conteo
  const getBeats = () => {
    if (exercise.practiceData?.beatMap?.beats) {
      return exercise.practiceData.beatMap.beats;
    }
    return exercise.contenido?.conteo || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  };

  // Helper: Get accent beats from practiceData or fallback to palo.acentos
  const getAccentBeats = () => {
    if (exercise.practiceData?.beatMap?.accentBeats) {
      return exercise.practiceData.beatMap.accentBeats;
    }
    return exercise.palo?.acentos || [1, 3, 5, 7, 9, 11];
  };

  // Bookmark handlers
  const handleAddBookmark = () => {
    const name = window.prompt('Nombre del marcador (ej: Entrada, Llamada, Letra):');
    if (!name || name.trim() === '') return;
    
    const newBookmark = {
      id: generateId(),
      lessonId: exercise.id,
      name: name.trim(),
      time: currentTime
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const handleGoToBookmark = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  const handleEditBookmark = (id) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;
    
    const newName = window.prompt('Editar nombre del marcador:', bookmark.name);
    if (!newName || newName.trim() === '') return;
    
    setBookmarks(prev => prev.map(b => 
      b.id === id ? { ...b, name: newName.trim() } : b
    ));
  };

  const handleDeleteBookmark = (id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // Sort bookmarks by time
  const sortedBookmarks = [...bookmarks].sort((a, b) => a.time - b.time);

  // Practice notes handlers
  const handleClearNotes = () => {
    setPracticeNotes('');
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
            <button
              className={`${styles.practiceModeToggle} ${practiceMode ? styles.practiceModeActive : ''}`}
              onClick={() => setPracticeMode(!practiceMode)}
              aria-label={practiceMode ? 'Desactivar modo práctica' : 'Activar modo práctica'}
              aria-pressed={practiceMode}
            >
              {practiceMode ? '● Modo práctica' : '○ Modo práctica'}
            </button>
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
      <section className={`${styles.section} ${practiceMode ? styles.sectionPractice : ''}`}>
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
          
          {/* Video - PracticePlayer */}
          <PracticePlayer
            ref={playerRef}
            videoSrc={getVideoSrc()}
            poster={`/images/${exercise.recursos?.video?.poster || ''}`}
            title={exercise.titulo}
            className={styles.videoPlayer}
            markers={getMarkers()}
            onTimeUpdate={(time, duration) => {
              // Update current time for bookmarks
              setCurrentTime(time);
              
              // Sincronización proporcional del BeatCounter
              const beats = getBeats();
              
              if (duration > 0) {
                const beatIndex = Math.floor((time / duration) * beats.length);
                const beat = Math.min(Math.max(beatIndex + 1, 1), beats.length);
                setCurrentBeat(beat);
              } else {
                setCurrentBeat(1);
              }
            }}
            onPlay={() => {
              // console.log('Video started');
            }}
            onPause={() => {
              // console.log('Video paused');
            }}
            onEnded={() => {
              // console.log('Video ended');
            }}
          />
          
          {/* BeatCounter integrado */}
          <div className={styles.beatCounterWrapper}>
            <h3 className={styles.subsectionTitle}>Compás</h3>
            <BeatCounter
              beats={getBeats()}
              currentBeat={currentBeat}
              accentBeats={getAccentBeats()}
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
      {!practiceMode && (
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
      )}

      {/* ===== 5. CONSEJOS DEL PROFESOR ===== */}
      {!practiceMode && exercise.contenido?.consejos && Array.isArray(exercise.contenido.consejos) && exercise.contenido.consejos.length > 0 && (
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
      {!practiceMode && (
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
      )}

      {/* ===== MARCADORES DE PRÁCTICA ===== */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Marcadores</h2>
          </div>
          
          <div className={styles.bookmarksContainer}>
            {/* Botón agregar marcador */}
            <button 
              className={styles.addBookmarkButton}
              onClick={handleAddBookmark}
              aria-label="Agregar marcador"
            >
              <Plus size={18} />
              <span>Agregar marcador</span>
            </button>
            
            {/* Lista de marcadores */}
            {sortedBookmarks.length > 0 ? (
              <div className={styles.bookmarksList}>
                {sortedBookmarks.map((bookmark) => (
                  <div key={bookmark.id} className={styles.bookmarkItem}>
                    <button
                      className={styles.bookmarkInfo}
                      onClick={() => handleGoToBookmark(bookmark.time)}
                      aria-label={`Ir a ${bookmark.name} en ${formatSecondsToDuration(bookmark.time)}`}
                    >
                      <span className={styles.bookmarkName}>{bookmark.name}</span>
                      <span className={styles.bookmarkTime}>{formatSecondsToDuration(bookmark.time)}</span>
                    </button>
                    <div className={styles.bookmarkActions}>
                      <button
                        className={styles.bookmarkActionButton}
                        onClick={() => handleEditBookmark(bookmark.id)}
                        aria-label={`Editar ${bookmark.name}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className={styles.bookmarkActionButton}
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        aria-label={`Eliminar ${bookmark.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.bookmarksEmpty}>
                No hay marcadores guardados. Haz clic en "Agregar marcador" mientras reproduces para guardar un punto importante.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===== NOTAS DE PRÁCTICA ===== */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Notas de práctica</h2>
          </div>
          
          <div className={styles.notesContainer}>
            <textarea
              className={styles.notesTextarea}
              value={practiceNotes}
              onChange={(e) => setPracticeNotes(e.target.value)}
              placeholder="Escribe aquí tus notas de práctica..."
              aria-label="Notas de práctica"
            />
            
            <div className={styles.notesFooter}>
              <button 
                className={styles.clearNotesButton}
                onClick={handleClearNotes}
                disabled={!practiceNotes}
                aria-label="Limpiar notas"
              >
                Limpiar notas
              </button>
              <span className={styles.notesHelp}>
                Las notas se guardan solo durante esta sesión.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. REPITE EL EJERCICIO ===== */}
      {!practiceMode && (
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
      )}
    </div>
  );
};

export default LessonPage;