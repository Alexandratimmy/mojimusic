import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import type { Song, Creator } from '../types';
import { featuredItems, trendingSongs, staffPicks } from '../constants';
import { PlayIcon, PauseIcon, RightArrowIcon, PlusIcon, MoreIcon, BookmarkFillIcon, BookmarkMenuIcon, HeartIcon, HeartFillIcon, PlayFillIcon, UserPlusIcon, CheckIcon } from './icons';

interface ExploreViewProps {
  currentlyPlaying: string | null;
  isPlaying: boolean;
  togglePlay: (songId: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  onAddToQueue: (songId: string) => void;
  library: Set<string>;
  onToggleInLibrary: (songId: string) => void;
  likedSongs: Set<string>;
  onToggleLike: (songId: string) => void;
  creators: Creator[];
  onToggleFollow: (creatorId: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const ContentSection: React.FC<{ title: string; children: React.ReactNode; showMore?: boolean }> = ({ title, children, showMore = true }) => (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {showMore && (
          <a href="#" className="text-sm font-semibold text-zinc-400 hover:text-white flex items-center gap-1">
            Show All <RightArrowIcon className="w-4 h-4" />
          </a>
        )}
      </div>
      {children}
    </section>
);

const StaffPickCard: React.FC<{
    song: Song;
    isPlaying: boolean;
    onPlay: () => void;
    onAddToQueue: (songId: string) => void;
    isInLibrary: boolean;
    onToggleInLibrary: (songId: string) => void;
    isLiked: boolean;
    onToggleLike: (songId: string) => void;
}> = ({ song, isPlaying, onPlay, onAddToQueue, isInLibrary, onToggleInLibrary, isLiked, onToggleLike }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        <div className="w-48 flex-shrink-0">
            <div className="relative group">
                <img src={song.albumArtUrl} alt={song.title} className="w-full h-48 rounded-lg object-cover" />
                 <button
                    onClick={onPlay}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    aria-label={`Play ${song.title}`}
                 >
                    {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                </button>
            </div>
            <div className="flex items-start justify-between mt-2">
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate text-white">{song.title}</h4>
                    <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                    <div className="flex items-center gap-3 text-zinc-500 text-xs mt-1">
                        {song.plays && <span className="flex items-center gap-1"><PlayFillIcon className="w-3 h-3"/> {song.plays}</span>}
                        {song.likes && <span className="flex items-center gap-1"><HeartIcon className="w-3 h-3"/> {song.likes}</span>}
                    </div>
                </div>
                 <div className="flex items-center shrink-0">
                     <button onClick={() => onToggleLike(song.id)} className={`p-1 ${isLiked ? 'text-red-500' : 'text-zinc-400'} hover:text-white`}>
                        {isLiked ? <HeartFillIcon className="w-5 h-5"/> : <HeartIcon className="w-5 h-5"/>}
                    </button>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(p => !p)} className="text-zinc-400 hover:text-white p-1 -mr-1" aria-label={`More options for ${song.title}`}>
                            <MoreIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div ref={menuRef} className="absolute right-0 top-8 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20">
                            <ul className="py-1">
                                <li>
                                    <button onClick={() => { onToggleInLibrary(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                                        {isInLibrary ? <BookmarkFillIcon className="w-4 h-4" /> : <BookmarkMenuIcon className="w-4 h-4" />}
                                        <span>{isInLibrary ? 'Saved' : 'Save'}</span>
                                    </button>
                                </li>
                                <li>
                                <button onClick={() => { onAddToQueue(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                                    <PlusIcon className="w-4 h-4" /> <span>Add to queue</span>
                                </button>
                                </li>
                            </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChartSongItem: React.FC<{
    song: Song;
    rank: number;
    isPlaying: boolean;
    onPlay: () => void;
    onAddToQueue: (songId: string) => void;
    isInLibrary: boolean;
    onToggleInLibrary: (songId: string) => void;
    isLiked: boolean;
    onToggleLike: (songId: string) => void;
}> = ({ song, rank, isPlaying, onPlay, onAddToQueue, isInLibrary, onToggleInLibrary, isLiked, onToggleLike }) => {
    return (
        <li className="group flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <div className="text-lg font-bold text-zinc-400 w-8 text-center">{rank}</div>
            <div className="relative w-14 h-14 rounded-md shrink-0">
                <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover rounded-md" />
                <button
                    onClick={onPlay}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    aria-label={`Play ${song.title}`}
                >
                    {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7" />}
                </button>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
            </div>
            <div className="text-sm text-zinc-400 w-20 text-right">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</div>
            <div className="flex items-center ml-auto">
                <button onClick={() => onToggleLike(song.id)} className={`p-2 transition-colors opacity-0 group-hover:opacity-100 ${isLiked ? 'text-red-500 opacity-100' : 'text-zinc-400'} hover:text-white`} title={isLiked ? 'Unlike' : 'Like'}>
                    {isLiked ? <HeartFillIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                </button>
                <button onClick={() => onToggleInLibrary(song.id)} className={`p-2 transition-colors opacity-0 group-hover:opacity-100 ${isInLibrary ? 'text-purple-400 opacity-100' : 'text-zinc-400'} hover:text-white`} title={isInLibrary ? 'Remove from Library' : 'Save to Library'}>
                    {isInLibrary ? <BookmarkFillIcon className="w-5 h-5" /> : <BookmarkMenuIcon className="w-5 h-5" />}
                </button>
                <button onClick={() => onAddToQueue(song.id)} className="p-2 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Add to queue">
                    <PlusIcon />
                </button>
            </div>
        </li>
    );
};

const CreatorCard: React.FC<{
    creator: Creator;
    onToggleFollow: (creatorId: string) => void;
}> = ({ creator, onToggleFollow }) => (
    <div className="bg-zinc-800/50 p-4 rounded-lg text-center transition-colors hover:bg-zinc-800">
        <img src={creator.imageUrl} alt={creator.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-3" />
        <h4 className="text-sm font-semibold truncate text-white">{creator.name}</h4>
        <p className="text-xs text-zinc-400 truncate">{creator.handle}</p>
        <button 
            onClick={() => onToggleFollow(creator.id)}
            className={`mt-3 w-full text-sm font-semibold py-1.5 rounded-full transition-colors ${
                creator.isFollowing
                ? 'bg-zinc-700 hover:bg-zinc-600'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
        >
            <span className="flex items-center justify-center gap-1.5">
                {creator.isFollowing ? <><CheckIcon className="w-4 h-4" /> Following</> : <><UserPlusIcon className="w-4 h-4"/> Follow</>}
            </span>
        </button>
    </div>
);

const topCategories = [
    { name: 'Pop', gradient: 'from-blue-500 to-cyan-400', imageUrl: 'https://picsum.photos/seed/catpop/400' },
    { name: 'Hip Hop', gradient: 'from-red-500 to-orange-400', imageUrl: 'https://picsum.photos/seed/cathiphop/400' },
    { name: 'Rock', gradient: 'from-yellow-500 to-amber-400', imageUrl: 'https://picsum.photos/seed/catrock/400' },
    { name: 'Electronic', gradient: 'from-purple-500 to-indigo-400', imageUrl: 'https://picsum.photos/seed/catelectro/400' },
    { name: 'Chill', gradient: 'from-pink-500 to-rose-400', imageUrl: 'https://picsum.photos/seed/catchill/400' },
];

const ExploreView: React.FC<ExploreViewProps> = ({ currentlyPlaying, isPlaying, togglePlay, searchQuery, onSearchQueryChange, onSearchSubmit, onAddToQueue, library, onToggleInLibrary, likedSongs, onToggleLike, creators, onToggleFollow, onBack, onForward, canGoBack, canGoForward }) => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
      <Header
        title="Explore"
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onSearchSubmit={onSearchSubmit}
        onBack={onBack}
        onForward={onForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-12">
        <ContentSection title="Featured Playlists" showMore={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map(item => (
              <div key={item.id} className={`relative rounded-xl overflow-hidden h-48 p-5 flex flex-col justify-end text-white bg-gradient-to-t ${item.gradient} group cursor-pointer`}>
                <img src={item.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" alt={item.title}/>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-sm opacity-80">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </ContentSection>

        <ContentSection title="Top Charts">
          <ol className="space-y-2">
            {trendingSongs.slice(0, 5).map((song, index) => (
              <ChartSongItem
                key={song.id}
                song={song}
                rank={index + 1}
                isPlaying={currentlyPlaying === song.id && isPlaying}
                onPlay={() => togglePlay(song.id)}
                onAddToQueue={onAddToQueue}
                isInLibrary={library.has(song.id)}
                onToggleInLibrary={onToggleInLibrary}
                isLiked={likedSongs.has(song.id)}
                onToggleLike={onToggleLike}
              />
            ))}
          </ol>
        </ContentSection>

        <ContentSection title="Staff Picks">
          <div className="flex gap-6 overflow-x-auto -mb-8 pb-8" style={{ scrollbarWidth: 'none' }}>
            {staffPicks.map(song => (
              <StaffPickCard
                key={song.id}
                song={song}
                isPlaying={currentlyPlaying === song.id && isPlaying}
                onPlay={() => togglePlay(song.id)}
                onAddToQueue={onAddToQueue}
                isInLibrary={library.has(song.id)}
                onToggleInLibrary={onToggleInLibrary}
                isLiked={likedSongs.has(song.id)}
                onToggleLike={onToggleLike}
              />
            ))}
          </div>
        </ContentSection>

        <ContentSection title="Browse Genres" showMore={false}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {topCategories.map(category => (
                    <div key={category.name} className={`relative rounded-xl overflow-hidden h-32 p-4 flex items-end text-white bg-gradient-to-t ${category.gradient} cursor-pointer group transition-transform hover:scale-105`}>
                        <img src={category.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" alt={category.name}/>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </ContentSection>

        <ContentSection title="Discover Creators" showMore={false}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {creators.map(creator => (
                    <CreatorCard key={creator.id} creator={creator} onToggleFollow={onToggleFollow} />
                ))}
            </div>
        </ContentSection>

      </div>
    </div>
  );
};

export default ExploreView;