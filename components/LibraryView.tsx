

import React from 'react';
import Header from './Header';
import SongListItem from './SongListItem';
import type { Song, SortOption, User } from '../types';

interface LibraryViewProps {
  songs: Song[];
  currentlyPlaying: string | null;
  togglePlay: (songId: string) => void;
  isPlaying: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  sortOption: SortOption;
  onSortOptionChange: (option: SortOption) => void;
  onAddToQueue: (songId: string) => void;
  onShufflePlay: () => void;
  onEditSong: (songId: string) => void;
  onDeleteSong: (songId: string) => void;
  library: Set<string>;
  onToggleInLibrary: (songId: string) => void;
  currentUser: User;
  allStyles: string[];
  styleFilter: string;
  onStyleFilterChange: (style: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const LibraryView: React.FC<LibraryViewProps> = ({ songs, currentlyPlaying, togglePlay, isPlaying, searchQuery, onSearchQueryChange, onSearchSubmit, sortOption, onSortOptionChange, onAddToQueue, onShufflePlay, onEditSong, onDeleteSong, onToggleInLibrary, currentUser, allStyles, styleFilter, onStyleFilterChange, onBack, onForward, canGoBack, canGoForward }) => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
      <Header 
        title="My Library"
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onSearchSubmit={onSearchSubmit}
        sortOption={sortOption}
        onSortOptionChange={onSortOptionChange}
        allStyles={allStyles}
        styleFilter={styleFilter}
        onStyleFilterChange={onStyleFilterChange}
        onShufflePlay={onShufflePlay}
        onBack={onBack}
        onForward={onForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {songs.length > 0 ? (
          <div className="space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-[48px_1fr_1fr_100px_100px] gap-4 px-4 text-xs text-zinc-400 font-semibold uppercase border-b border-zinc-800 pb-2">
              <div className="col-start-2">Title</div>
              <div>Style</div>
              <div className="text-center">Duration</div>
              <div className="text-right">Actions</div>
            </div>
            {songs.map((song) => (
              <SongListItem
                key={song.id} 
                song={song}
                isPlaying={currentlyPlaying === song.id && isPlaying}
                onPlayPause={() => togglePlay(song.id)}
                onAddToQueue={onAddToQueue}
                onEdit={onEditSong}
                onDelete={onDeleteSong}
                onToggleInLibrary={onToggleInLibrary}
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-zinc-500 mt-16 border-2 border-dashed border-zinc-700 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-zinc-300">Your library is empty</h3>
            <p className="mt-2 text-sm">Find songs you like and click the 'Save' button to add them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;