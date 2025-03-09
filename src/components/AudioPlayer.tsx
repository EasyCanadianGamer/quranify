// src/components/AudioPlayer.tsx
import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaForward, FaStepForward } from 'react-icons/fa';

const CustomAudioPlayer = ({
  audioUrl,
  onNext,
  title,
}: {
  audioUrl: string;
  onNext?: () => void;
  title?: string;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Update current time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        // console.log('Current Time:', audio.currentTime); // Debugging log
        setCurrentTime(audio.currentTime);
      };

      // Add event listeners
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      // Cleanup event listeners
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [audioUrl]); // Re-run effect when audioUrl changes

  // Play/pause handler
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Seek handler
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Format time (e.g., 01:23)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {/* Title */}
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}

      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={handlePlayPause}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
        <button
          onClick={() => handleSeek(currentTime + 10)} // Seek forward by 10 seconds
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FaForward size={20} />
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FaStepForward size={20} />
          </button>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default CustomAudioPlayer;