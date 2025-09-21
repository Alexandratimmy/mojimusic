
import React, { useState, useEffect } from 'react';
import type { Song } from '../types';
import { CloseIcon, TrashIcon } from './icons';

interface EditSongModalProps {
  song: Song;
  onSave: (updatedSong: Partial<Song> & { id: string }) => void;
  onClose: () => void;
  onDelete: (songId: string) => void;
}

const stringifyLyrics = (lyrics: Song['lyrics']): string => {
    if (!lyrics) return '';
    if (typeof lyrics === 'string') return lyrics;
    // It's LyricLine[]
    return lyrics.map(line => line.text).join('\n');
};

const EditSongModal: React.FC<EditSongModalProps> = ({ song, onSave, onClose, onDelete }) => {
  const [title, setTitle] = useState(song.title);
  const [description, setDescription] = useState(song.description);
  const [lyrics, setLyrics] = useState(stringifyLyrics(song.lyrics));
  const [style, setStyle] = useState(song.style);

  const isTimedLyrics = Array.isArray(song.lyrics);

  useEffect(() => {
    setTitle(song.title);
    setDescription(song.description);
    setLyrics(stringifyLyrics(song.lyrics));
    setStyle(song.style);
  }, [song]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);


  const handleSave = () => {
    const updatedSong: Partial<Song> & { id: string } = {
      id: song.id,
      title,
      description,
      style,
    };

    if (!isTimedLyrics) {
        updatedSong.lyrics = lyrics;
    }
    
    onSave(updatedSong);
  };

  const handleDelete = () => {
    onDelete(song.id);
    onClose();
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-2xl border border-zinc-700 transform transition-all flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="p-6 border-b border-zinc-700 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Edit Song</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="edit-title" className="text-sm font-medium text-zinc-300 block mb-1">Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="edit-style" className="text-sm font-medium text-zinc-300 block mb-1">Style</label>
            <input
              id="edit-style"
              type="text"
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="text-sm font-medium text-zinc-300 block mb-1">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
            />
          </div>
          <div>
            <label htmlFor="edit-lyrics" className="text-sm font-medium text-zinc-300 block mb-1">Lyrics</label>
            <textarea
              id="edit-lyrics"
              value={lyrics}
              onChange={e => setLyrics(e.target.value)}
              rows={8}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y font-mono disabled:bg-zinc-800/50 disabled:cursor-not-allowed"
              disabled={isTimedLyrics}
            />
             {isTimedLyrics && (
              <p className="text-xs text-zinc-500 mt-2">
                Editing for songs with timed lyrics is not supported to preserve timing data.
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6 flex justify-between items-center gap-4 border-t border-zinc-700 shrink-0">
           <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600/20 text-red-400 font-semibold rounded-full hover:bg-red-600/30 transition-colors text-sm flex items-center gap-2"
          >
            <TrashIcon /> Delete Song
          </button>
          <div className="flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 text-white font-semibold rounded-full hover:bg-zinc-600 transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSongModal;
