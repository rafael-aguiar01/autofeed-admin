import React, { useState, useRef, useEffect } from "react";

function AudioPlayer({ url, className = "" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <audio
        ref={audioRef}
        src={url}
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}

export default AudioPlayer;
