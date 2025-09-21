

import React, { useState, useRef, useEffect } from 'react';
import type { Song, User } from '../types';
import { PlayIcon, PauseIcon, MoreIcon, HeartIcon, ShareIcon, DownloadIcon, HeartFillIcon, PlusIcon, EditIcon, PlayFillIcon, MessageCircleIcon, BookmarkMenuIcon, BookmarkFillIcon, TrashIcon } from './icons';

interface SongCardProps {
    song: Song;
    currentUser: User;
    isPlaying: boolean;
    onPlayPause: () => void;
    onAddToQueue: (songId: string) => void;
    onEdit?: (songId: string) => void;
    onDelete?: (songId: string) => void;
    isInLibrary: boolean;
    onToggleInLibrary: (songId: string) => void;
    isLiked: boolean;
    onToggleLike: (songId: string) => void;
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SongCard: React.FC<SongCardProps> = ({ song, currentUser, isPlaying, onPlayPause, onAddToQueue, onEdit, onDelete, isInLibrary, onToggleInLibrary, isLiked, onToggleLike }) => {
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

    const handleShare = async () => {
        const shareData = {
            title: song.title,
            text: `Check out this song "${song.title}" by ${song.artist}!`,
            url: window.location.href, // Placeholder URL for now
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing song:', err);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(song.audioUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const fileName = `${song.artist || 'Unknown Artist'} - ${song.title}.mp3`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Could not download the song. The audio URL may be invalid or protected.');
        }
    };

    return (
        <div className="flex items-start gap-4 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700/50 transition-colors border border-zinc-700">
            <div className="relative w-24 h-24 shrink-0">
                <img src={song.albumArtUrl} alt={song.title} className="w-full h-full rounded-md object-cover" />
                <button 
                    onClick={onPlayPause}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity rounded-md"
                    aria-label={`Play or pause ${song.title}`}
                >
                    {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
                </button>
                <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(song.duration)}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold truncate text-white">
                    {song.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-medium bg-purple-600/50 text-purple-200 px-2 py-0.5 rounded-full">{song.style}</span>
                    <span className="text-xs font-medium bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{song.version}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{song.description}</p>
                 <div className="flex items-center gap-4 text-zinc-400 text-xs mt-3">
                    {song.plays && <span className="flex items-center gap-1.5"><PlayFillIcon /> {song.plays}</span>}
                    {song.likes && <span className="flex items-center gap-1.5"><HeartIcon className="w-3 h-3" /> {song.likes}</span>}
                    {song.comments && <span className="flex items-center gap-1.5"><MessageCircleIcon /> {song.comments}</span>}
                </div>
                 <div className="mt-4 flex items-center gap-4 text-zinc-400 text-sm">
                    <button onClick={() => onToggleLike(song.id)} className={`flex items-center gap-1.5 hover:text-white transition-colors ${isLiked ? 'text-red-500 hover:text-red-400' : ''}`}>
                        {isLiked ? <HeartFillIcon className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                        <span>Like</span>
                    </button>
                    <button onClick={() => onToggleInLibrary(song.id)} className={`flex items-center gap-1.5 hover:text-white transition-colors ${isInLibrary ? 'text-purple-400 hover:text-purple-300' : ''}`}>
                        {isInLibrary ? <BookmarkFillIcon className="w-4 h-4" /> : <BookmarkMenuIcon className="w-4 h-4" />}
                        <span>{isInLibrary ? 'Saved' : 'Save'}</span>
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <ShareIcon className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <DownloadIcon className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                 </div>
            </div>
            <div className="relative">
                <button onClick={() => setIsMenuOpen(p => !p)} className="text-zinc-400 hover:text-white p-2 self-start" aria-label={`More options for ${song.title}`}>
                    <MoreIcon />
                </button>
                {isMenuOpen && (
                    <div ref={menuRef} className="absolute right-0 top-10 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20">
                    <ul className="py-1">
                        <li>
                        <button onClick={() => { onAddToQueue(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" /> <span>Add to queue</span>
                        </button>
                        </li>
                        {isOwnSong && onEdit && (
                            <li>
                                <button onClick={() => { onEdit(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                                    <EditIcon className="w-4 h-4" /> <span>Edit Song</span>
                                </button>
                            </li>
                        )}
                         {isOwnSong && onDelete && (
                            <li>
                                <button onClick={() => { onDelete(song.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-700 flex items-center gap-2">
                                    <TrashIcon className="w-4 h-4" /> <span>Delete Song</span>
                                </button>
                            </li>
                        )}
                    </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongCard;