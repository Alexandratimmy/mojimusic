

import React, { useState, useEffect, useRef } from 'react';
import type { Song, RepeatMode } from '../types';
import { PlayIcon, PauseIcon, PreviousIcon, NextIcon, VolumeHighIcon, VolumeMediumIcon, VolumeLowIcon, VolumeMuteIcon, LyricsIcon, ShuffleIcon, ExpandIcon, RepeatIcon, RepeatOneIcon } from './icons';

interface PlayerProps {
  song: Song;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isShuffling: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  analyser: AnalyserNode | null;
  onExpand: () => void;
}

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Player: React.FC<PlayerProps> = ({ song, isPlaying, progress, volume, isShuffling, repeatMode, onPlayPause, onNext, onPrev, onSeek, onVolumeChange, onToggleShuffle, onToggleRepeat, analyser, onExpand }) => {
  const [showLyrics, setShowLyrics] = useState(false);
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const duration = song.duration;
  const isDisabled = !duration || duration <= 0;

  useEffect(() => {
    setShowLyrics(false);
  }, [song.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setIsVolumeControlVisible(false);
      }
    };

    if (isVolumeControlVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVolumeControlVisible]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width / bufferLength) * 1.5;

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progressRatio = (progress / duration);
      const progressPx = progressRatio * canvas.width;

      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        const isPlayed = x < progressPx;
        
        ctx.fillStyle = isPlayed ? '#ffffff' : '#4b5563'; // White for played, gray for unplayed
        ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);
        
        x += barWidth + 2; // barwidth + gap
      }
    };

    if (isPlaying) {
      draw();
    } else {
      // Draw one static frame when paused
       analyser.getByteFrequencyData(dataArray);
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       const progressRatio = (progress / duration);
       const progressPx = progressRatio * canvas.width;
 
       let x = 0;
       for (let i = 0; i < bufferLength; i++) {
         const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
         const isPlayed = x < progressPx;
         ctx.fillStyle = isPlayed ? '#ffffff' : '#4b5563';
         ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);
         x += barWidth + 2;
       }
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, isPlaying, progress, duration]);


  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    
    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekRatio = clickX / width;
    
    const newTime = seekRatio * duration;
    
    onSeek(newTime);
  };
  
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeMuteIcon />;
    if (volume < 0.34) return <VolumeLowIcon />;
    if (volume < 0.67) return <VolumeMediumIcon />;
    return <VolumeHighIcon />;
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return <RepeatOneIcon />;
      case 'all': return <RepeatIcon />;
      case 'off':
      default: return <RepeatIcon />;
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-md text-white border-t border-zinc-800 flex flex-col transition-all duration-300">
        {showLyrics && song.lyrics && (
            <div className="max-h-60 overflow-y-auto p-6 text-center text-zinc-300 whitespace-pre-wrap font-mono text-sm tracking-wide leading-relaxed border-b border-zinc-700/50">
                {/* FIX: Render lyrics correctly whether it's a string or an array of LyricLine objects. */}
                <p>{Array.isArray(song.lyrics) ? song.lyrics.map(l => l.text).join('\n') : song.lyrics}</p>
            </div>
        )}
      <div className="p-3 flex items-center gap-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onExpand}>
            <img src={song.albumArtUrl} alt={song.title} className="w-14 h-14 rounded-md" />
            <div className="w-48">
              <p className="font-semibold text-sm truncate">{song.title}</p>
              <p className="text-xs text-zinc-400 truncate">{song.style}</p>
            </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-4">
          <button onClick={onToggleShuffle} className={`transition-colors ${isShuffling ? 'text-purple-400' : 'text-zinc-400 hover:text-white'}`} aria-label="Toggle shuffle">
            <ShuffleIcon />
          </button>
          <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors" aria-label="Previous song">
            <PreviousIcon />
          </button>
          <button 
            onClick={onPlayPause} 
            className="bg-white text-black rounded-full p-2 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
          <button onClick={onNext} className="text-zinc-400 hover:text-white transition-colors" aria-label="Next song">
            <NextIcon />
          </button>
          <button onClick={onToggleRepeat} className={`transition-colors ${repeatMode !== 'off' ? 'text-purple-400' : 'text-zinc-400 hover:text-white'}`} aria-label="Toggle repeat">
            {getRepeatIcon()}
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 group">
          <span className="text-xs text-zinc-400 w-10 text-right">{formatTime(progress)}</span>
          <div 
            className="relative w-full h-8 flex items-center cursor-pointer" 
            onClick={handleSeekClick}
          >
            <canvas ref={canvasRef} width="300" height="32" className="w-full h-full" />
            <input
                type="range"
                min="0"
                max={duration || 1}
                value={progress}
                onChange={(e) => onSeek(Number(e.target.value))}
                disabled={isDisabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Song progress"
            />
            <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${(progress / duration) * 100}%` }}
            />
          </div>
          <span className="text-xs text-zinc-400 w-10">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-1">
            <div className="relative" ref={volumeControlRef}>
                <button
                    onClick={() => setIsVolumeControlVisible(prev => !prev)}
                    className="text-zinc-400 hover:text-white transition-colors p-2"
                    aria-label="Adjust volume"
                >
                    {getVolumeIcon()}
                </button>
                {isVolumeControlVisible && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={onVolumeChange}
                            className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer range-sm [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            aria-label="Volume control"
                        />
                    </div>
                )}
            </div>
            {song.lyrics && (
            <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`text-zinc-400 hover:text-white transition-colors p-2 ${showLyrics ? 'text-purple-400' : ''}`}
                aria-label="Toggle lyrics"
                title="Show lyrics"
            >
                <LyricsIcon />
            </button>
            )}
             <button
                onClick={onExpand}
                className="text-zinc-400 hover:text-white transition-colors p-2"
                aria-label="Full screen player"
                title="Full screen"
            >
                <ExpandIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Player;