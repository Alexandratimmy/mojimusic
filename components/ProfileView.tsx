

import React, { useState } from 'react';
import SongCard from './SongCard';
import type { Song, User } from '../types';
import { EditIcon } from './icons';

interface ProfileViewProps {
  user: User;
  songs: Song[];
  currentlyPlaying: string | null;
  togglePlay: (songId: string) => void;
  isPlaying: boolean;
  onAddToQueue: (songId: string) => void;
  onShufflePlay: () => void;
  onEditSong: (songId: string) => void;
  onDeleteSong: (songId: string) => void;
  onUpdateUser: (updatedUser: Partial<User>) => void;
  library: Set<string>;
  onToggleInLibrary: (songId: string) => void;
  likedSongs: Set<string>;
  onToggleLike: (songId: string) => void;
}

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-zinc-400">{label}</p>
    </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ user, songs, currentlyPlaying, togglePlay, isPlaying, onAddToQueue, onShufflePlay, onEditSong, onDeleteSong, onUpdateUser, library, onToggleInLibrary, likedSongs, onToggleLike }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  const handleSave = () => {
    const trimmedName = editedName.trim();
    if (trimmedName) {
      onUpdateUser({ name: trimmedName });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Check if there are actual changes to the name, ignoring whitespace.
    if (editedName.trim() !== user.name) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        // User confirmed, so discard changes.
        setEditedName(user.name);
        setIsEditing(false);
      }
      // If user clicks "Cancel" on the confirmation, do nothing.
    } else {
      // No changes, so just close the editor.
      setEditedName(user.name);
      setIsEditing(false);
    }
  };
  
  const isSaveDisabled = editedName.trim() === '';

  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="p-8 bg-zinc-800/50 flex flex-col items-center text-center border-b border-zinc-700">
            <img 
                src={user.imageUrl} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-zinc-900"
            />
            {isEditing ? (
                <>
                    <div className="flex flex-col items-center w-full max-w-xs mt-4">
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-3xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isSaveDisabled) handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                        />
                         <p className="text-zinc-400 mt-1">{user.handle}</p>
                        <div className="flex items-center gap-4 mt-6">
                            <button onClick={handleSave} disabled={isSaveDisabled} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 text-sm disabled:bg-purple-800 disabled:cursor-not-allowed">Save</button>
                            <button onClick={handleCancel} className="px-6 py-2 bg-zinc-700 text-white font-semibold rounded-full hover:bg-zinc-600 text-sm">Cancel</button>
                        </div>
                    </div>
                </>
            ) : (
                 <>
                    <div className="flex items-center gap-3 mt-4">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <button onClick={() => setIsEditing(true)} className="p-1 text-zinc-400 hover:text-white" aria-label="Edit name">
                            <EditIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-zinc-400 mt-1">{user.handle}</p>
                    <div className="flex items-center gap-8 mt-6">
                        <Stat value={songs.length} label="Creations" />
                        <Stat value={user.followers} label="Followers" />
                        <Stat value={user.following} label="Following" />
                    </div>
                </>
            )}
        </div>

        {/* User's Songs */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">My Creations</h2>
          <div className="grid grid-cols-1 gap-6">
            {songs.length > 0 ? (
              songs.map((song) => (
                <SongCard 
                  key={song.id} 
                  song={song}
                  currentUser={user}
                  isPlaying={currentlyPlaying === song.id && isPlaying}
                  onPlayPause={() => togglePlay(song.id)}
                  onAddToQueue={onAddToQueue}
                  onEdit={onEditSong}
                  onDelete={onDeleteSong}
                  isInLibrary={library.has(song.id)}
                  onToggleInLibrary={onToggleInLibrary}
                  isLiked={likedSongs.has(song.id)}
                  onToggleLike={onToggleLike}
                />
              ))
            ) : (
                <div className="text-center text-zinc-400 py-16">
                    <p>You haven't created any songs yet.</p>
                    <p className="text-sm mt-2">Go to the 'Create' page to make your first track!</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;