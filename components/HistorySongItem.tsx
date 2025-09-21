import React from 'react';
import type { Song } from '../types';
import { PlayIcon, PauseIcon, PlusIcon } from './icons';

interface HistorySongItemProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onAddToQueue: (songId: string) => void;
}

const HistorySongItem: React.FC<HistorySongItemProps> = ({ song, isPlaying, onPlayPause, onAddToQueue }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
      <div className="relative w-12 h-12 shrink-0">
        <img src={song.albumArtUrl} alt={song.title} className="w-full h-full rounded-md object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate text-white">{song.title}</h4>
        <p className="text-xs text-zinc-400 truncate">{song.style}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
        >
          {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => onAddToQueue(song.id)}
          className="p-2 rounded-full text-zinc-300 bg-zinc-700 hover:bg-zinc-600 transition-colors"
          aria-label={`Add ${song.title} to queue`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HistorySongItem;
