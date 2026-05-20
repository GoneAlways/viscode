import { useRef, useState } from 'react';

export default function VideoPlayer({ videoUrl }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handleOverlayClick = () => {
    videoRef.current.play();
    setPlaying(true);
  };

  const handlePause = () => setPlaying(false);
  const handleEnded = () => setPlaying(false);

  return (
    <div className="player-wrapper">
      <video
        ref={videoRef}
        src={videoUrl}
        controls={playing}
        onPause={handlePause}
        onEnded={handleEnded}
      />
      <div
        className={`player-overlay ${playing ? 'hidden' : ''}`}
        onClick={handleOverlayClick}
      >
        <button className="play-btn" aria-label="播放" />
      </div>
    </div>
  );
}
