

import React, { useState, useEffect, useRef } from 'react';
import type { Song, RepeatMode, VisualizerStyle, ColorTheme } from '../types';
import { 
    PlayIcon, PauseIcon, PreviousIcon, NextIcon, 
    VolumeHighIcon, VolumeMediumIcon, VolumeLowIcon, VolumeMuteIcon, 
    ShuffleIcon, RepeatIcon, RepeatOneIcon, CollapseIcon, HeartIcon, HeartFillIcon,
    SettingsIcon
} from './icons';

interface FullScreenPlayerProps {
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
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onClose: () => void;
  analyser: AnalyserNode | null;
  isLiked: boolean;
  onToggleLike: () => void;
  visualizerStyle: VisualizerStyle;
  onSetVisualizerStyle: (style: VisualizerStyle) => void;
  colorTheme: ColorTheme;
  onSetColorTheme: (theme: ColorTheme) => void;
}

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const colorThemes: Record<ColorTheme, string[]> = {
    purple_haze: ['rgba(192, 132, 252, 0.4)', 'rgba(255, 255, 255, 0.7)'],
    oceanic: ['rgba(56, 189, 248, 0.4)', 'rgba(34, 211, 238, 0.7)'],
    sunset: ['rgba(251, 146, 60, 0.5)', 'rgba(239, 68, 68, 0.8)'],
    monochrome: ['rgba(229, 231, 235, 0.5)', 'rgba(255, 255, 255, 0.9)'],
};

const visualizerOptions: { id: VisualizerStyle; name: string }[] = [
    { id: 'circular', name: 'Circular' },
    { id: 'bars', name: 'Bars' },
    { id: 'wave', name: 'Wave' },
    { id: 'off', name: 'Off' },
];

const colorThemeOptions: { id: ColorTheme; name: string }[] = [
    { id: 'purple_haze', name: 'Purple Haze' },
    { id: 'oceanic', name: 'Oceanic' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'monochrome', name: 'Monochrome' },
];


const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  song, isPlaying, progress, volume, isShuffling, repeatMode,
  onPlayPause, onNext, onPrev, onSeek, onVolumeChange,
  onToggleShuffle, onToggleRepeat, onClose, analyser,
  isLiked, onToggleLike,
  visualizerStyle, onSetVisualizerStyle, colorTheme, onSetColorTheme
}) => {
  const duration = song.duration;
  const isDisabled = !duration || duration <= 0;

  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lyricLineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  const timedLyrics = Array.isArray(song.lyrics) ? song.lyrics : null;

  useEffect(() => {
    if (timedLyrics) {
      lyricLineRefs.current = lyricLineRefs.current.slice(0, timedLyrics.length);
    }
  }, [timedLyrics]);

  useEffect(() => {
    if (!timedLyrics) {
      setCurrentLyricIndex(-1);
      return;
    }

    let newIndex = -1;
    for (let i = timedLyrics.length - 1; i >= 0; i--) {
      if (progress >= timedLyrics[i].time) {
        newIndex = i;
        break;
      }
    }
    
    if (newIndex !== currentLyricIndex) {
        setCurrentLyricIndex(newIndex);
    }
  }, [progress, timedLyrics, currentLyricIndex]);

  useEffect(() => {
    if (currentLyricIndex !== -1 && lyricsContainerRef.current) {
      const activeLineElement = lyricLineRefs.current[currentLyricIndex];
      const containerElement = lyricsContainerRef.current;
      
      if (activeLineElement && containerElement) {
        const containerHeight = containerElement.clientHeight;
        const elementTop = activeLineElement.offsetTop;
        const elementHeight = activeLineElement.clientHeight;
        const targetScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);

        containerElement.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [currentLyricIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (settingsPanelRef.current && !settingsPanelRef.current.contains(event.target as Node)) {
            setIsSettingsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser || visualizerStyle === 'off') {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
    }
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const [color1, color2] = colorThemes[colorTheme];

    const draw = () => {
        animationFrameId.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, rect.width, rect.height);
        
        switch (visualizerStyle) {
            case 'circular':
                drawCircular(ctx, dataArray, bufferLength, rect, color1, color2);
                break;
            case 'bars':
                drawBars(ctx, dataArray, bufferLength, rect, color1, color2);
                break;
            case 'wave':
                 drawWave(ctx, dataArray, bufferLength, rect, color1, color2);
                break;
        }
    };
    
    if (isPlaying) {
      draw();
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, isPlaying, song.id, visualizerStyle, colorTheme]);


  const drawCircular = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, rect: DOMRect, color1: string, color2: string) => {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const imageWidth = rect.width / 1.2;
    const innerRadius = (imageWidth / 2) * 1.05;

    const barsToDraw = Math.floor(bufferLength * 0.7);
      for (let i = 0; i < barsToDraw; i++) {
        const barHeight = Math.max((dataArray[i] - 50) / 255 * 60, 0);
        if (barHeight <= 0) continue;

        const angle = (i / barsToDraw) * Math.PI * 2 - Math.PI / 2;
        const x1 = centerX + innerRadius * Math.cos(angle);
        const y1 = centerY + innerRadius * Math.sin(angle);
        const x2 = centerX + (innerRadius + barHeight) * Math.cos(angle);
        const y2 = centerY + (innerRadius + barHeight) * Math.sin(angle);
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
  };

  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, rect: DOMRect, color1: string, color2: string) => {
    const barWidth = (rect.width / bufferLength) * 1.5;
    let x = 0;
    const gradient = ctx.createLinearGradient(0, rect.height, 0, 0);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 255 * rect.height * 0.6;
        ctx.fillRect(x, rect.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
    }
  };

  const drawWave = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, rect: DOMRect, color1: string, color2: string) => {
    const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    const sliceWidth = rect.width * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * rect.height / 2;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    ctx.lineTo(rect.width, rect.height / 2);
    ctx.stroke();
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
  
  const VisSettingButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${isActive ? 'bg-purple-600 text-white' : 'hover:bg-white/10'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-zinc-900 z-50 flex flex-col p-4 md:p-8 text-white animate-slide-up">
      {/* Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: `url(${song.albumArtUrl})`,
          filter: 'blur(50px) brightness(0.4)',
          transform: 'scale(1.1)'
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 mb-4">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <CollapseIcon />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 grid md:grid-cols-2 gap-8 lg:gap-16 overflow-y-auto min-h-0">
        {/* Left: Album Art */}
        <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    className="absolute w-[120%] h-[120%]"
                    style={{ display: visualizerStyle === 'circular' ? 'block' : 'none' }}
                />
                <img
                    src={song.albumArtUrl}
                    alt={song.title}
                    className="w-full h-full rounded-2xl shadow-2xl shadow-black/50 object-cover"
                />
            </div>
            <div className="mt-6 flex justify-between items-center w-full max-w-sm">
                <div>
                    <h1 className="text-2xl font-bold text-left">{song.title}</h1>
                    <p className="text-zinc-300 text-left">{song.artist || 'AI Music Generator'}</p>
                </div>
                <button onClick={onToggleLike} className={`p-2 transition-colors ${isLiked ? 'text-red-500' : 'text-zinc-400'} hover:text-red-400`}>
                    {isLiked ? <HeartFillIcon className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
                </button>
            </div>
        </div>

        {/* Right: Lyrics */}
        <div className="flex flex-col pb-8">
            <h2 className="text-lg font-bold text-zinc-300 mb-4 flex-shrink-0">Lyrics</h2>
            <div ref={lyricsContainerRef} className="overflow-y-auto flex-1 rounded-lg p-1 pr-4">
                {timedLyrics ? (
                    <ul className="transition-all duration-500 space-y-4">
                        {timedLyrics.map((line, index) => (
                            <li
                                key={`${song.id}-${index}`}
                                ref={el => { lyricLineRefs.current[index] = el; }}
                                className={`font-mono text-base md:text-lg leading-relaxed transition-all duration-300 ${
                                    currentLyricIndex === index
                                        ? 'text-white font-bold scale-105'
                                        : 'text-zinc-400 opacity-70'
                                }`}
                            >
                                {line.text || '\u00A0'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-zinc-200 whitespace-pre-wrap font-mono text-base md:text-lg leading-relaxed">
                        {typeof song.lyrics === 'string' ? song.lyrics : "No lyrics available for this song."}
                    </p>
                )}
            </div>
        </div>
      </div>

      {/* Visualizer for non-circular types */}
      <canvas
        ref={visualizerStyle !== 'circular' ? canvasRef : null}
        className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none"
        style={{ display: visualizerStyle !== 'circular' && visualizerStyle !== 'off' ? 'block' : 'none' }}
      />


      {/* Controls */}
      <div className="relative z-10 flex-shrink-0 mt-auto pt-4">
        {/* Seek Bar */}
        <div className="flex items-center gap-4">
            <span className="text-xs w-12 text-center">{formatTime(progress)}</span>
            <div className="relative w-full h-2 bg-white/20 rounded-full group">
                <div 
                    className="absolute h-full bg-white rounded-full" 
                    style={{ width: `${(progress / duration) * 100}%` }}
                />
                <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${(progress / duration) * 100}%` }}
                />
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
            </div>
            <span className="text-xs w-12 text-center">{formatTime(duration)}</span>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center justify-between mt-4">
            <div className="w-1/3 flex justify-start relative">
                <button
                    onClick={() => setIsSettingsOpen(p => !p)}
                    className="p-2 text-zinc-400 hover:text-white"
                    aria-label="Visualizer settings"
                >
                    <SettingsIcon />
                </button>
                {isSettingsOpen && (
                    <div ref={settingsPanelRef} className="absolute bottom-12 left-0 bg-zinc-800/80 backdrop-blur-md p-4 rounded-lg w-64 border border-zinc-700 shadow-lg">
                        <h4 className="font-semibold text-sm mb-2 text-zinc-300">Visualizer Style</h4>
                        <div className="grid grid-cols-2 gap-2 text-white">
                            {visualizerOptions.map(opt => (
                                <VisSettingButton key={opt.id} onClick={() => onSetVisualizerStyle(opt.id)} isActive={visualizerStyle === opt.id}>
                                    {opt.name}
                                </VisSettingButton>
                            ))}
                        </div>
                        <h4 className="font-semibold text-sm mt-4 mb-2 text-zinc-300">Color Theme</h4>
                        <div className="space-y-1 text-white">
                             {colorThemeOptions.map(opt => (
                                <VisSettingButton key={opt.id} onClick={() => onSetColorTheme(opt.id)} isActive={colorTheme === opt.id}>
                                    {opt.name}
                                </VisSettingButton>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center gap-4">
                <button onClick={onToggleShuffle} className={`p-2 transition-colors ${isShuffling ? 'text-purple-400' : 'text-zinc-400 hover:text-white'}`} aria-label="Toggle shuffle">
                    <ShuffleIcon className="w-5 h-5"/>
                </button>
                <button onClick={onPrev} className="p-2 text-zinc-200 hover:text-white transition-colors" aria-label="Previous song">
                    <PreviousIcon className="w-8 h-8"/>
                </button>
                <button 
                    onClick={onPlayPause} 
                    className="bg-white text-black rounded-full p-4 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                </button>
                <button onClick={onNext} className="p-2 text-zinc-200 hover:text-white transition-colors" aria-label="Next song">
                    <NextIcon className="w-8 h-8"/>
                </button>
                <button onClick={onToggleRepeat} className={`p-2 transition-colors ${repeatMode !== 'off' ? 'text-purple-400' : 'text-zinc-400 hover:text-white'}`} aria-label="Toggle repeat">
                    {getRepeatIcon()}
                </button>
            </div>
            <div className="w-1/3 flex justify-end items-center gap-2">
                {getVolumeIcon()}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer range-sm [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    aria-label="Volume control"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenPlayer;