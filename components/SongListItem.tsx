

import React, { useState, useRef, useEffect } from 'react';
import type { Song, User } from '../types';
import { PlayIcon, PauseIcon, MoreIcon, PlusIcon, EditIcon, BookmarkFillIcon, TrashIcon } from './icons';

interface SongListItemProps {
  song: Song;
  isPlaying: boolean;
  currentUser: User;
  onPlayPause: () => void;
  onToggleInLibrary: (songId: string) => void;
  onEdit: (songId: string) => void;
  onDelete: (songId: string) => void;
  onAddToQueue: (songId: string) => void;
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SongListItem: React.FC<SongListItemProps> = ({ song, isPlaying, currentUser, onPlayPause, onToggleInLibrary, onEdit, onDelete, onAddToQueue }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOwnSong = song.artist === currentUser.name;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="grid grid-cols-[48px_1fr_1fr_100px_100px] gap-4 items-center p-2 rounded-lg hover:bg-zinc-800 group">
      {/* Play/Album Art */}
      <div className="relative w-10 h-10 shrink-0">
          <img src={song.albumArtUrl} alt={song.title} className="w-full h-full rounded-md object-cover" />
          <button 
              onClick={onPlayPause}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
              aria-label={`Play or pause ${song.title}`}
          >
              {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
      </div>
      
      {/* Title/Artist */}
      <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-white">{song.title}</p>
          <p className="text-xs truncate text-zinc-400">{song.artist}</p>
      </div>

      {/* Style */}
      <div className="text-sm text-zinc-400 truncate">
          {song.style}
      </div>

      {/* Duration */}
      <div className="text-sm text-zinc-400 text-center">
          {formatDuration(song.duration)}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 text-zinc-400">
        <button onClick={() => onToggleInLibrary(song.id)} className="p-2 hover:text-white transition-colors opacity-0 group-hover:opacity-100" title="Remove from Library">
            <BookmarkFillIcon className="w-5 h-5 text-purple-400" />
        </button>
        <div className="relative">
            <button onClick={() => setIsMenuOpen(p => !p)} className="p-2 hover:text-white transition-colors opacity-0 group-hover:opacity-100" aria-label={`More options for ${song.title}`}>
                <MoreIcon className="w-5 h-5" />
            </button>
            {isMenuOpen && (
                <div ref={menuRef} className="absolute right-0 bottom-full mb-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20">
                <ul className="py-1">
                    <li>
                    <button onClick={() => { onAddToQueue(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" /> <span>Add to queue</span>
                    </button>
                    </li>
                    {isOwnSong && (
                        <>
                            <li>
                                <button onClick={() => { onEdit(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                                    <EditIcon className="w-4 h-4" /> <span>Edit Song</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => { onDelete(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-700 flex items-center gap-2">
                                    <TrashIcon className="w-4 h-4" /> <span>Delete Song</span>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SongListItem;