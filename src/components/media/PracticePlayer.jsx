import { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Repeat2, Flag, X } from 'lucide-react';
import styles from './PracticePlayer.module.css';

// ===== CONSTANTES GLOBALES =====
const CONTROLS_HIDE_DELAY_MS = 1000; // 1 segundo

/**
 * PracticePlayer - Reproductor de vidbeen resolvedeo profesional para Tibiritábara
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
const PracticePlayer = forwardRef(({
  videoSrc,
  poster,
  title = 'Video',
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  markers = [],
  className = ''
}, ref) => {
  // Referencias
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const controlsHideTimerRef = useRef(null);
  const progressRef = useRef(null);
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const isInteractingRef = useRef(false);

  // Estados
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [abLoopEnabled, setAbLoopEnabled] = useState(false);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [showCursor, setShowCursor] = useState(true);

  // ===== SISTEMA DE CONTROLES INTELIGENTE =====
  // Estas funciones deben definirse PRIMERAMENTE porque son usadas por otros callbacks
  const clearControlsHideTimer = useCallback(() => {
    if (controlsHideTimerRef.current) {
      window.clearTimeout(controlsHideTimerRef.current);
      controlsHideTimerRef.current = null;
    }
  }, []);

  const scheduleControlsHide = useCallback(() => {
    clearControlsHideTimer();
    
    controlsHideTimerRef.current = window.setTimeout(() => {
      const video = videoRef.current;
      if (
        !isInteractingRef.current &&
        video &&
        !video.paused &&
        !video.ended
      ) {
        setShowControls(false);
        setShowCursor(false);
      }
      controlsHideTimerRef.current = null;
    }, CONTROLS_HIDE_DELAY_MS);
  }, [clearControlsHideTimer]);

  // Expose imperative methods to parent component
  useImperativeHandle(ref, () => ({
    seekTo(time) {
      if (!videoRef.current) return;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    },
    getCurrentTime() {
      return videoRef.current?.currentTime || 0;
    }
  }));

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

  // Marcar punto A
  const markPointA = useCallback(() => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    setPointA(currentTime);
    // Si ya existe B y A >= B, eliminar B
    if (pointB !== null && currentTime >= pointB) {
      setPointB(null);
      setAbLoopEnabled(false);
    }
  }, [pointB]);

  // Marcar punto B
  const markPointB = useCallback(() => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    // Validar que B > A
    if (pointA !== null && currentTime > pointA) {
      setPointB(currentTime);
    } else {
      // No se puede establecer B antes o igual que A
      setPointB(null);
      setAbLoopEnabled(false);
    }
  }, [pointA]);

  // Toggle A-B Loop
  const toggleABLoop = useCallback(() => {
    if (pointA !== null && pointB !== null && pointB > pointA) {
      setAbLoopEnabled((prev) => !prev);
    }
  }, [pointA, pointB]);

  // Limpiar A-B Loop
  const clearABLoop = useCallback(() => {
    setPointA(null);
    setPointB(null);
    setAbLoopEnabled(false);
  }, []);

  // Manejar click en marcador
  const handleMarkerClick = useCallback((time) => {
    if (!videoRef.current) return;
    
    const wasPlaying = isPlaying;
    
    // Cambiar al tiempo del marcador
    videoRef.current.currentTime = time;
    setCurrentTime(time);
    
    // Si estaba reproduciendo, asegurar que continúe
    if (wasPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  // Calcular marcador activo (tolerancia ±0.35 segundos)
  const activeMarker = useMemo(() => {
    if (!markers || markers.length === 0) return null;
    
    const tolerance = 0.35;
    let closest = null;
    let closestDistance = Infinity;
    
    for (const marker of markers) {
      const distance = Math.abs(currentTime - marker.time);
      if (distance <= tolerance && distance < closestDistance) {
        closest = marker;
        closestDistance = distance;
      }
    }
    
    return closest;
  }, [currentTime, markers]);

  // Formatear tiempo con decimales (para A-B Loop)
  const formatTimeWithDecimals = useCallback((time) => {
    if (time === null || time === undefined || isNaN(time)) return '--:--.00';
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
  }, []);

  // Calcular duración del segmento A-B
  const abLoopDuration = useCallback(() => {
    if (pointA !== null && pointB !== null) {
      return pointB - pointA;
    }
    return null;
  }, [pointA, pointB]);

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

  // Actualizar progreso desde evento pointer
  const updateProgressFromPointer = useCallback((e) => {
    if (!progressRef.current || !videoRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    if (clientX === undefined) return;
    
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Manejar inicio de arrastre en scrubber
  const handleProgressPointerDown = useCallback((e) => {
    if (!progressRef.current || !videoRef.current || !duration) {
      return;
    }

    e.preventDefault();

    isDraggingRef.current = true;
    activePointerIdRef.current = e.pointerId;
    isInteractingRef.current = true;

    progressRef.current.setPointerCapture?.(e.pointerId);

    setShowControls(true);
    setShowCursor(true);
    clearControlsHideTimer();
    updateProgressFromPointer(e);
  }, [duration, clearControlsHideTimer, updateProgressFromPointer]);

  // Manejar movimiento durante arrastre en scrubber
  const handleProgressPointerMove = useCallback((e) => {
    if (
      !isDraggingRef.current ||
      activePointerIdRef.current !== e.pointerId
    ) {
      return;
    }

    e.preventDefault();
    updateProgressFromPointer(e);
  }, [updateProgressFromPointer]);

  // Finalizar interacción con scrubber
  const finishProgressInteraction = useCallback((e) => {
    if (
      !isDraggingRef.current ||
      activePointerIdRef.current !== e.pointerId
    ) {
      return;
    }

    const progressElement = progressRef.current;

    if (progressElement?.hasPointerCapture?.(e.pointerId)) {
      progressElement.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    activePointerIdRef.current = null;
    isInteractingRef.current = false;

    const video = videoRef.current;

    if (video && !video.paused && !video.ended) {
      scheduleControlsHide();
    } else {
      clearControlsHideTimer();
      setShowControls(true);
    }
  }, [scheduleControlsHide, clearControlsHideTimer]);

  // Manejar click en barra de progreso (fallback para click simple)
  const handleProgressClick = useCallback((e) => {
    // Si está arrastrando, ignorar click (ya se manejó con pointer events)
    if (isDraggingRef.current) return;
    
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    
    // Mantener controles visibles después de la interacción
    setShowControls(true);
    setShowCursor(true);
    clearControlsHideTimer();
    
    const video = videoRef.current;
    if (video && !video.paused && !video.ended) {
      scheduleControlsHide();
    }
  }, [duration, clearControlsHideTimer, scheduleControlsHide]);

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

      // Verificar si estamos en A-B Loop y pasamos el punto B
      if (abLoopEnabled && pointA !== null && pointB !== null) {
        const current = videoRef.current.currentTime;
        if (current >= pointB) {
          videoRef.current.currentTime = pointA;
          // No pausamos, continuamos reproduciendo desde A
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [isPlaying, handleTimeUpdate, abLoopEnabled, pointA, pointB]);

  // Efectos
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Event listeners
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoLoaded(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleVideoEnded = () => {
      // A-B Loop tiene prioridad absoluta
      if (abLoopEnabled && pointA !== null && pointB !== null) {
        videoRef.current.currentTime = pointA;
        videoRef.current.play().catch(() => {});
        return;
      }

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
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleVideoEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleVideoEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onEnded, isLooping, abLoopEnabled, pointA, pointB]);

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

  // Manejar pointer down (touch/pen) - mostrar controles sin hacer play/pause
  const handlePointerDown = useCallback((event) => {
    // Solo para touch/pen, no para mouse
    if (event.pointerType === 'mouse') {
      return;
    }

    setShowControls(true);
    clearControlsHideTimer();

    if (isPlaying) {
      scheduleControlsHide();
    }
  }, [isPlaying, clearControlsHideTimer, scheduleControlsHide]);

  // Manejar pointer enter (mouse) - mostrar controles
  const handlePointerEnter = useCallback(() => {
    setShowControls(true);
    if (isPlaying) {
      clearControlsHideTimer();
    }
  }, [isPlaying, clearControlsHideTimer]);

  // Manejar pointer leave (mouse) - permitir ocultamiento
  const handlePointerLeave = useCallback(() => {
    if (isPlaying) {
      scheduleControlsHide();
    }
  }, [isPlaying, scheduleControlsHide]);

  // Manejar pointer move (solo mouse) - mostrar controles y reiniciar temporizador
  const handlePointerMove = useCallback((event) => {
    if (event.pointerType === 'mouse') {
      setShowControls(true);
      if (isPlaying) {
        scheduleControlsHide();
      }
    }
  }, [isPlaying, scheduleControlsHide]);

  // Manejar error de video
  const handleError = useCallback(() => {
    setHasError(true);
    setVideoLoaded(true);
  }, []);

  // Limpiar temporizador al desmontar
  useEffect(() => {
    return () => {
      clearControlsHideTimer();
    };
  }, [clearControlsHideTimer]);

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${className || ''} ${isFullscreen ? styles.fullscreen : ''} ${!showCursor ? styles.cursorHidden : ''}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
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


        {/* Mensaje de error */}
        {hasError && (
          <div className={styles.errorOverlay}>
            <p>No se pudo cargar el video</p>
          </div>
        )}

        {/* Botón Play centrado grande - visible cuando no se reproduce */}
        {!isPlaying && videoLoaded && !hasError && (
          <button
            className={styles.centerPlayButton}
            onClick={togglePlay}
            aria-label="Reproducir video"
            title="Reproducir video"
            type="button"
          >
            <Play size={48} fill="currentColor" />
          </button>
        )}

          {/* Controles */}
        <div 
          className={`${styles.controls} ${showControls || !isPlaying ? styles.controlsVisible : ''}`}
        >
          {/* Barra de progreso */}
          <div 
            ref={progressRef}
            className={styles.progressContainer}
            onClick={handleProgressClick}
            onPointerDown={handleProgressPointerDown}
            onPointerMove={handleProgressPointerMove}
            onPointerUp={finishProgressInteraction}
            onPointerCancel={finishProgressInteraction}
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

          {/* Segmento de práctica (A-B Loop) */}
          <div className={styles.abLoopSection}>
            <span className={styles.abLoopLabel}>Segmento de práctica</span>
            <div className={styles.abLoopButtons}>
              <button
                className={`${styles.abLoopButton} ${pointA !== null ? styles.abLoopButtonSet : ''}`}
                onClick={markPointA}
                aria-label="Marcar punto A"
                disabled={!videoLoaded}
              >
                <Flag size={16} />
                Marcar A
              </button>
              <button
                className={`${styles.abLoopButton} ${pointB !== null ? styles.abLoopButtonSet : ''}`}
                onClick={markPointB}
                aria-label="Marcar punto B"
                disabled={!videoLoaded || pointA === null}
              >
                <Flag size={16} />
                Marcar B
              </button>
              <button
                className={`${styles.abLoopButton} ${abLoopEnabled ? styles.abLoopButtonActive : ''}`}
                onClick={toggleABLoop}
                aria-label={abLoopEnabled ? 'Desactivar segmento A-B' : 'Activar segmento A-B'}
                aria-pressed={abLoopEnabled}
                disabled={!videoLoaded || pointA === null || pointB === null || pointB <= pointA}
              >
                <Repeat2 size={16} />
                {abLoopEnabled ? 'A-B Activado' : 'Activar A-B'}
              </button>
              <button
                className={styles.abLoopButton}
                onClick={clearABLoop}
                aria-label="Limpiar segmento A-B"
                disabled={!videoLoaded || (pointA === null && pointB === null)}
              >
                <X size={16} />
                Limpiar
              </button>
            </div>
            {/* Display de puntos A, B y duración */}
            {(pointA !== null || pointB !== null) && (
              <div className={styles.abLoopPoints}>
                <span className={styles.abLoopPoint}>
                  A: {formatTimeWithDecimals(pointA)}
                </span>
                {pointB !== null && (
                  <>
                    <span className={styles.abLoopPoint}>
                      B: {formatTimeWithDecimals(pointB)}
                    </span>
                    {abLoopDuration() !== null && (
                      <span className={`${styles.abLoopPoint} ${styles.abLoopDuration}`}>
                        Duración: {formatTimeWithDecimals(abLoopDuration())}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Marcadores */}
          {markers && markers.length > 0 && (
            <div className={styles.markersSection}>
              <span className={styles.markersLabel}>Marcadores</span>
              <div className={styles.markersList}>
                {markers.map((marker) => (
                  <button
                    key={marker.id}
                    className={`${styles.markerButton} ${activeMarker?.id === marker.id ? styles.markerActive : ''}`}
                    onClick={() => handleMarkerClick(marker.time)}
                    aria-label={`Ir a ${marker.label} en ${formatTime(marker.time)}`}
                  >
                    {marker.label}
                    <span className={styles.markerTime}>{formatTime(marker.time)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default PracticePlayer;
