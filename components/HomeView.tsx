import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { View, Song, Creator, User } from '../types';
import { featuredItems, trendingSongs, staffPicks } from '../constants';
import { PlayIcon, PauseIcon, RightArrowIcon, MoreIcon, PlusIcon, BookmarkMenuIcon, BookmarkFillIcon, HeartIcon, HeartFillIcon, UserPlusIcon, CheckIcon } from './icons';

interface HomeViewProps {
  setView: (view: View) => void;
  songs: Song[];
  creators: Creator[];
  listeningHistory: string[];
  currentlyPlaying: string | null;
  isPlaying: boolean;
  togglePlay: (songId: string) => void;
  onAddToQueue: (songId:string) => void;
  onToggleFollow: (creatorId: string) => void;
  library: Set<string>;
  onToggleInLibrary: (songId: string) => void;
  currentUser: User;
  likedSongs: Set<string>;
  onToggleLike: (songId: string) => void;
}

const parsePlays = (plays: string | undefined): number => {
    if (!plays) return 0;
    const lower = plays.toLowerCase().trim();
    if (lower.endsWith('k')) {
        return parseFloat(lower.slice(0, -1)) * 1000;
    }
    if (lower.endsWith('m')) {
        return parseFloat(lower.slice(0, -1)) * 1000000;
    }
    return parseInt(lower, 10) || 0;
};

const VideoCard: React.FC<{
  setView: (view: View) => void;
}> = ({ setView }) => {
  return (
    <section className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setView('explore')}>
      <video
        src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Discover What's New</h2>
        <p className="mt-2 max-w-lg text-lg text-zinc-300">
          Explore fresh sounds from the community and our latest AI model updates.
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setView('explore');
          }}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full self-start transition-transform group-hover:scale-105"
        >
          Explore Now
        </button>
      </div>
    </section>
  );
};

const ContentSection: React.FC<{ title: string; children: React.ReactNode; onShowMore?: () => void }> = ({ title, children, onShowMore }) => (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {onShowMore && (
          <button onClick={onShowMore} className="text-sm font-semibold text-zinc-400 hover:text-white flex items-center gap-1">
            Show More <RightArrowIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  );

const SongCarouselCard: React.FC<{
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
                </div>
                <div className="flex items-center">
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

const CreatorCard: React.FC<{
    creator: Creator;
    onToggleFollow: (creatorId: string) => void;
}> = ({ creator, onToggleFollow }) => (
    <div className="w-40 flex-shrink-0 text-center">
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


const HomeView: React.FC<HomeViewProps> = ({ setView, songs, creators, listeningHistory, currentlyPlaying, isPlaying, togglePlay, onAddToQueue, onToggleFollow, library, onToggleInLibrary, currentUser, likedSongs, onToggleLike }) => {
    
    const recentlyPlayedSongs = useMemo(() => {
        return listeningHistory.map(id => songs.find(s => s.id === id)).filter(Boolean) as Song[];
    }, [listeningHistory, songs]);

    const newSongs = useMemo(() => {
        return [...songs].sort((a, b) => (a.id < b.id ? 1 : -1)).slice(0, 10);
    }, [songs]);

    const topTrending = useMemo(() => {
        return [...trendingSongs].sort((a,b) => parsePlays(b.plays) - parsePlays(a.plays)).slice(0, 10);
    }, []);

    const topStaffPicks = useMemo(() => {
        return [...staffPicks].slice(0, 10);
    }, []);

    return (
        <div className="p-6 space-y-12">
            <VideoCard setView={setView} />

            {recentlyPlayedSongs.length > 0 && (
                <ContentSection title="Recently Played" onShowMore={() => setView('library')}>
                    <div className="flex gap-6 overflow-x-auto -mb-8 pb-8" style={{ scrollbarWidth: 'none' }}>
                        {recentlyPlayedSongs.map(song => (
                             <SongCarouselCard
                                key={`history-${song.id}`}
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
            )}

            <ContentSection title="New Songs from Moji" onShowMore={() => setView('explore')}>
                <div className="flex gap-6 overflow-x-auto -mb-8 pb-8" style={{ scrollbarWidth: 'none' }}>
                    {newSongs.map(song => (
                         <SongCarouselCard
                            key={`new-${song.id}`}
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

            <ContentSection title="Trending" onShowMore={() => setView('explore')}>
                <div className="flex gap-6 overflow-x-auto -mb-8 pb-8" style={{ scrollbarWidth: 'none' }}>
                    {topTrending.map(song => (
                         <SongCarouselCard
                            key={`trending-${song.id}`}
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

            <ContentSection title="Staff Picks" onShowMore={() => setView('explore')}>
                <div className="flex gap-6 overflow-x-auto -mb-8 pb-8" style={{ scrollbarWidth: 'none' }}>
                    {topStaffPicks.map(song => (
                         <SongCarouselCard
                            key={`staff-${song.id}`}
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

            <ContentSection title="Discover Creators" onShowMore={() => setView('explore')}>
                <div className="flex gap-6 overflow-x-auto -mb-8 pb-8" style={{ scrollbarWidth: 'none' }}>
                    {creators.map(creator => (
                        <CreatorCard key={creator.id} creator={creator} onToggleFollow={onToggleFollow} />
                    ))}
                </div>
            </ContentSection>
        </div>
    );
};

export default HomeView;