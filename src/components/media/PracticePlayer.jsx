import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Repeat2 } from 'lucide-react';
import styles from './PracticePlayer.module.css';

/**
 * PracticePlayer - Reproductor de video profesional para Tibiritábara
 * 
 * Componente desacoplado del dominio, enfocado únicamente en reproducción de video.
 * Diseñado para crecer con futuras funcionalidades (velocidad, loop, sincronización, etc.)
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.videoSrc - URL del video a reproducir
 * @param {string} props.poster - URL de la imagen poster (opcional)
 * @param {string} props.title - Título descriptivo del video (opcional, para accesibilidad)
 * @param {Function} props.onTimeUpdate - Callback cuando cambia el tiempo (currentTime, duration)
 * @param {Function} props.onPlay - Callback al iniciar reproducción
 * @param {Function} props.onPause - Callback al pausar
 * @param {Function} props.onEnded - Callback al terminar el video
 * @param {string} props.className - Clase CSS adicional para personalización
 */
const PracticePlayer = ({
  videoSrc,
  poster,
  title = 'Video',
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  className = ''
}) => {
  // Referencias
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Estados
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  // Velocidades disponibles
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5];

  // Cambiar velocidad de reproducción
  const changePlaybackRate = useCallback((rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  }, []);

  // Toggle Loop
  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  // Formatear tiempo a MM:SS
  const formatTime = useCallback((time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Calcular porcentaje de progreso
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      videoRef.current.play().catch(err => {
        console.error('Error al reproducir:', err);
      });
      setIsPlaying(true);
      onPlay?.();
    }
  }, [isPlaying, onPlay, onPause]);

  // Reiniciar video (volver a 0)
  const restart = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
  }, []);

  // Manejar click en barra de progreso
  const handleProgressClick = useCallback((e) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.mozRequestFullScreen) {
          await containerRef.current.mozRequestFullScreen();
        } else if (containerRef.current.msRequestFullscreen) {
          await containerRef.current.msRequestFullscreen();
        }
      } catch (err) {
        console.error('Error al activar fullscreen:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Manejar cambios de tiempo (actualizado frecuentemente para UI)
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    
    // Callback para sincronización externa
    onTimeUpdate?.(current, duration);
  }, [duration, onTimeUpdate]);

  // Actualizar tiempo con requestAnimationFrame para suavidad
  const updateTime = useCallback(() => {
    if (isPlaying && videoRef.current) {
      handleTimeUpdate();
    }
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [isPlaying, handleTimeUpdate]);

  // Efectos
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Event listeners
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoLoaded(true);
    };

    const handleEnded = () => {
      if (isLooping) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        setIsPlaying(false);
      }
      onEnded?.();
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onEnded]);

  // Loop de actualización
  useEffect(() => {
    if (isPlaying) {
      updateTime();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateTime]);

  // Manejar hover para mostrar controles
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  }, [isPlaying]);

  // Manejar movimiento del mouse (reaparecer controles)
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setShowControls(false);
        }
      }, 2000);
    }
  }, [isPlaying, isHovering]);

  // Manejar error de video
  const handleError = useCallback(() => {
    setHasError(true);
    setVideoLoaded(true);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${className || ''} ${isFullscreen ? styles.fullscreen : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Contenedor de video */}
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.videoElement}
          poster={poster}
          title={title}
          playsInline
          onError={handleError}
        >
          <source src={videoSrc} type="video/mp4" />
          Tu navegador no soporta la reproducción de video.
        </video>

        {/* Overlay de poster (cuando no está cargado o no se está reproduciendo) */}
        {!isPlaying && poster && (
          <div className={styles.posterOverlay}>
            <img src={poster} alt={title} className={styles.posterImage} />
            <button 
              className={styles.bigPlayButton}
              onClick={togglePlay}
              aria-label="Reproducir video"
            >
              <Play size={48} fill="currentColor" />
            </button>
          </div>
        )}

        {/* Mensaje de error */}
        {hasError && (
          <div className={styles.errorOverlay}>
            <p>No se pudo cargar el video</p>
          </div>
        )}

          {/* Controles */}
        <div 
          className={`${styles.controls} ${showControls || !isPlaying ? styles.controlsVisible : ''}`}
        >
          {/* Barra de progreso */}
          <div 
            className={styles.progressContainer}
            onClick={handleProgressClick}
            role="slider"
            aria-label="Barra de progreso del video"
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div 
              className={styles.progressKnob}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Controles principales */}
          <div className={styles.controlsRow}>
            <div className={styles.controlsLeft}>
              {/* Botón Play/Pause */}
              <button
                className={styles.controlButton}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                disabled={!videoLoaded}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} fill="currentColor" />
                )}
              </button>

              {/* Botón Reiniciar */}
              <button
                className={styles.controlButton}
                onClick={restart}
                aria-label="Reiniciar video"
                disabled={!videoLoaded}
              >
                <RotateCcw size={20} />
              </button>

              {/* Tiempo */}
              <div className={styles.timeDisplay}>
                <span className={styles.currentTime}>{formatTime(currentTime)}</span>
                <span className={styles.timeSeparator}>/</span>
                <span className={styles.totalTime}>{formatTime(duration)}</span>
              </div>
            </div>

            <div className={styles.controlsRight}>
              {/* Botón Fullscreen */}
              <button
                className={styles.controlButton}
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? (
                  <Minimize size={20} />
                ) : (
                  <Maximize size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Control de velocidad */}
          <div className={styles.playbackRateSection}>
            <span className={styles.playbackRateLabel}>Velocidad</span>
            <div className={styles.playbackRateButtons}>
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  className={`${styles.playbackRateButton} ${playbackRate === rate ? styles.active : ''}`}
                  onClick={() => changePlaybackRate(rate)}
                  aria-label={`Velocidad ${rate}x`}
                  aria-pressed={playbackRate === rate}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Control de Loop */}
          <div className={styles.loopSection}>
            <span className={styles.loopLabel}>Repetición</span>
            <button
              className={`${styles.loopButton} ${isLooping ? styles.active : ''}`}
              onClick={toggleLoop}
              aria-label={isLooping ? 'Desactivar repetición' : 'Activar repetición'}
              aria-pressed={isLooping}
            >
              <Repeat2 size={18} />
              {isLooping ? 'Loop activado' : 'Loop desactivado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePlayer;