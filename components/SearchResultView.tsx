


import React from 'react';
import Header from './Header';
import SongCard from './SongCard';
import type { Song, SortOption, User } from '../types';

interface SearchResultViewProps {
  songs: Song[];
  currentlyPlaying: string | null;
  togglePlay: (songId: string) => void;
  isPlaying: boolean;
  query: string;
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
  likedSongs: Set<string>;
  onToggleLike: (songId: string) => void;
  allStyles: string[];
  styleFilter: string;
  onStyleFilterChange: (style: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const SearchResultView: React.FC<SearchResultViewProps> = ({ songs, currentlyPlaying, togglePlay, isPlaying, query, searchQuery, onSearchQueryChange, onSearchSubmit, sortOption, onSortOptionChange, onAddToQueue, onShufflePlay, onEditSong, onDeleteSong, library, onToggleInLibrary, currentUser, likedSongs, onToggleLike, allStyles, styleFilter, onStyleFilterChange, onBack, onForward, canGoBack, canGoForward }) => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
      <Header 
        title="Search Results"
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
        <h2 className="text-xl font-semibold mb-4 text-zinc-300">
          {songs.length > 0 ? `Results for "${query}"` : `No results found for "${query}"`}
        </h2>
        {songs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {songs.map((song) => (
              <SongCard 
                key={song.id} 
                song={song}
                currentUser={currentUser}
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
            ))}
          </div>
        ) : (
          <div className="text-center text-zinc-400 mt-16">
            <p>Try searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultView;