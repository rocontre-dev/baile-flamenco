import styles from './BeatCounter.module.css';

/**
 * Reusable Beat Counter component
 * Displays beats for any flamenco palo
 * @param {Object} props - Component props
 * @param {number[]} props.beats - Array of beat numbers (e.g., [1,2,3,4,5,6,7,8,9,10,11,12])
 * @param {number} props.currentBeat - Currently active beat
 * @param {number[]} props.accentBeats - Array of accented beats
 * @param {Function} props.onBeatClick - Click handler for beat selection
 */
const BeatCounter = ({
  beats = [],
  currentBeat = 0,
  accentBeats = [],
  onBeatClick = () => {}
}) => {
  if (beats.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.beats}>
        {beats.map((beat) => {
          const isActive = beat === currentBeat;
          const isAccent = accentBeats.includes(beat);
          
          return (
            <button
              key={beat}
              className={`${styles.beat} ${isActive ? styles.active : ''} ${isAccent ? styles.accent : ''}`}
              onClick={() => onBeatClick(beat)}
              aria-label={`Beat ${beat}${isAccent ? ' (accent)' : ''}`}
              aria-pressed={isActive}
            >
              <span className={styles.beatNumber}>{beat}</span>
              {isAccent && <span className={styles.accentMark} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BeatCounter;