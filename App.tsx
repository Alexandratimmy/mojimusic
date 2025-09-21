



import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import Sidebar from './components/Sidebar';
import CreateView from './components/CreateView';
import LibraryView from './components/LibraryView';
import HomeView from './components/HomeView';
import SearchResultView from './components/SearchResultView';
import RadioView from './components/RadioView';
import ExploreView from './components/ExploreView';
import ProfileView from './components/ProfileView';
import NotificationsView from './components/NotificationsView';
import UpgradeView from './components/UpgradeView';
import WhatsNewView from './components/WhatsNewView';
import MoreFromMojiView from './components/MoreFromMojiView';
import Player from './components/Player';
import FullScreenPlayer from './components/FullScreenPlayer';
import EditSongModal from './components/EditSongModal';
import BuyCreditsModal from './components/BuyCreditsModal';
import type { Song, View, SortOption, Creator, User, Notification, RepeatMode, RadioStation, VisualizerStyle, ColorTheme } from './types';
import { suggestedCreators, currentUser as currentUserConstant, mockNotifications, whatsNewPosts } from './constants';
import { getSongs, addSong as addSongToDb, updateSong as updateSongInDb, deleteSong as deleteSongFromDb } from './services/supabaseService';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [songs, setSongs] = useState<Song[]>([]);
  const [creators, setCreators] = useState<Creator[]>(suggestedCreators);
  const [currentUser, setCurrentUser] = useState<User>({ ...currentUserConstant, credits: 50, plan: 'Free' });
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    try {
        const storedSortOption = localStorage.getItem('sortOption');
        return (storedSortOption as SortOption) || 'date_desc';
    } catch (error) {
        console.error("Failed to read sort option from localStorage", error);
        return 'date_desc';
    }
  });
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [listeningHistory, setListeningHistory] = useState<string[]>([]);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [library, setLibrary] = useState<Set<string>>(new Set());
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());

  const [queue, setQueue] = useState<Song[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [playHistory, setPlayHistory] = useState<string[]>([]);

  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
  const [whatsNewCount, setWhatsNewCount] = useState(0);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);

  // Data fetching states
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Visualizer settings
  const [visualizerStyle, setVisualizerStyle] = useState<VisualizerStyle>('circular');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('purple_haze');

  // Navigation History
  const [history, setHistory] = useState<View[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const currentSong = songs.find(song => song.id === currentlyPlaying);

  const unreadNotificationsCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  
  const allStyles = useMemo(() => {
    const stylesSet = new Set<string>();
    songs.forEach(song => {
      song.style.split(',').forEach(s => {
        const trimmed = s.trim();
        if (trimmed) {
          stylesSet.add(trimmed);
        }
      });
    });
    return ['all', ...Array.from(stylesSet).sort()];
  }, [songs]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            setIsLoadingSongs(true);
            setLoadError(null);
            const fetchedSongs = await getSongs();
            setSongs(fetchedSongs);
        } catch (error: any) {
            setLoadError(error.message || "Failed to load songs from the database.");
            console.error(error);
        } finally {
            setIsLoadingSongs(false);
        }
    };

    fetchInitialData();

    try {
      const storedHistory = localStorage.getItem('listeningHistory');
      if (storedHistory) {
        setListeningHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse listening history from localStorage", error);
      localStorage.removeItem('listeningHistory');
    }

    try {
        const storedLibrary = localStorage.getItem('userLibrary');
        if (storedLibrary) {
            setLibrary(new Set(JSON.parse(storedLibrary)));
        } else {
            // No default library loading from user's songs anymore as it's dynamic
        }
    } catch (error) {
        console.error("Failed to parse library from localStorage", error);
        localStorage.removeItem('userLibrary');
    }

    try {
        const lastSeenUpdateId = localStorage.getItem('lastSeenUpdateId');
        if (!lastSeenUpdateId) {
            setWhatsNewCount(whatsNewPosts.length);
        } else {
            const lastSeenIndex = whatsNewPosts.findIndex(p => p.id === lastSeenUpdateId);
            if (lastSeenIndex !== -1) {
                setWhatsNewCount(lastSeenIndex);
            } else {
                setWhatsNewCount(whatsNewPosts.length);
            }
        }
    } catch (error) {
        console.error("Failed to read from localStorage", error);
        setWhatsNewCount(whatsNewPosts.length);
    }
  }, []);

  const handleSetView = useCallback((newView: View, isNavigating = false) => {
    if (newView === 'whats_new') {
        try {
            if (whatsNewPosts.length > 0) {
                localStorage.setItem('lastSeenUpdateId', whatsNewPosts[0].id);
            }
            setWhatsNewCount(0);
        } catch (error) {
            console.error("Failed to write to localStorage", error);
        }
    }

    if (!isNavigating) {
        const newHistory = history.slice(0, historyIndex + 1);
        // Prevent pushing the same view consecutively
        if (newHistory[newHistory.length - 1] !== newView) {
            newHistory.push(newView);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    }
    setView(newView);
  }, [history, historyIndex]);

  const handleBack = useCallback(() => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      handleSetView(history[newIndex], true);
    }
  }, [canGoBack, history, historyIndex, handleSetView]);

  const handleForward = useCallback(() => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      handleSetView(history[newIndex], true);
    }
  }, [canGoForward, history, historyIndex, handleSetView]);


  const setupAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
          console.error("Web Audio API is not supported in this browser.");
          return;
      }
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    
    if (audioRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  const addSong = useCallback(async (newSong: Omit<Song, 'id'>) => {
    try {
        const addedSong = await addSongToDb(newSong);
        setSongs(prevSongs => [addedSong, ...prevSongs]);
        setLibrary(prevLibrary => {
            const newLibrary = new Set(prevLibrary);
            newLibrary.add(addedSong.id);
            try {
                localStorage.setItem('userLibrary', JSON.stringify(Array.from(newLibrary)));
            } catch (error) {
                console.error("Failed to save library to localStorage", error);
            }
            return newLibrary;
        });
    } catch (error) {
        console.error("Failed to add song:", error);
        // Here you could set an error state to show a notification to the user
    }
  }, []);
  
  const handleToggleFollow = useCallback((creatorId: string) => {
    setCreators(prevCreators => 
      prevCreators.map(creator => 
        creator.id === creatorId 
          ? { ...creator, isFollowing: !creator.isFollowing }
          : creator
      )
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);
  
  const handleDeleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const handleOpenEditModal = useCallback((songId: string) => {
    setEditingSongId(songId);
  }, []);

  const handleCloseEditModal = useCallback(() => {
      setEditingSongId(null);
  }, []);

  const handleSaveSong = useCallback(async (updatedSongData: Partial<Song> & { id: string }) => {
    try {
        const savedSong = await updateSongInDb(updatedSongData);
        setSongs(prevSongs =>
          prevSongs.map(song =>
            song.id === savedSong.id ? savedSong : song
          )
        );
    } catch (error) {
        console.error("Failed to save song:", error);
    } finally {
        setEditingSongId(null);
    }
  }, []);
  
  const handleDeleteSong = useCallback(async (songId: string) => {
    if (!window.confirm("Are you sure you want to delete this song? This action is permanent and cannot be undone.")) {
        return;
    }

    try {
        await deleteSongFromDb(songId);

        setSongs(prev => prev.filter(s => s.id !== songId));
        setLibrary(prev => {
            const newLibrary = new Set(prev);
            newLibrary.delete(songId);
            try {
                localStorage.setItem('userLibrary', JSON.stringify(Array.from(newLibrary)));
            } catch (error) {
                console.error("Failed to save library to localStorage", error);
            }
            return newLibrary;
        });
        setLikedSongs(prev => {
            const newLiked = new Set(prev);
            newLiked.delete(songId);
            return newLiked;
        });
        setQueue(prev => prev.filter(s => s.id !== songId));
        
        if (currentlyPlaying === songId) {
            setIsPlaying(false);
            setCurrentlyPlaying(null);
        }
    } catch(error) {
        console.error("Failed to delete song:", error);
    }
  }, [currentlyPlaying]);

  const handleUpgrade = useCallback((plan: 'Pro' | 'Premium', credits: number) => {
    setCurrentUser(prevUser => ({
        ...prevUser,
        plan,
        credits,
    }));
    handleSetView('home'); 
  }, [handleSetView]);

  const handleUpdateUser = useCallback((updatedUserData: Partial<User>) => {
    const oldName = currentUser.name;
    const newName = updatedUserData.name;

    setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedUserData,
    }));

    if (newName && newName !== oldName) {
        setSongs(prevSongs => prevSongs.map(song => song.artist === oldName ? { ...song, artist: newName } : song));
    }
  }, [currentUser.name]);

  const handleOpenBuyCreditsModal = useCallback(() => setIsBuyCreditsModalOpen(true), []);
  const handleCloseBuyCreditsModal = useCallback(() => setIsBuyCreditsModalOpen(false), []);
  const handlePurchaseCredits = useCallback((amount: number) => {
    setCurrentUser(prev => ({ ...prev, credits: prev.credits + amount }));
    setIsBuyCreditsModalOpen(false);
  }, []);

  const handleSortOptionChange = useCallback((option: SortOption) => {
    setSortOption(option);
    try {
        localStorage.setItem('sortOption', option);
    } catch (error) {
        console.error("Failed to save sort option to localStorage", error);
    }
  }, []);
  
  const handleToggleInLibrary = useCallback((songId: string) => {
    setLibrary(prevLibrary => {
      const newLibrary = new Set(prevLibrary);
      if (newLibrary.has(songId)) {
        newLibrary.delete(songId);
      } else {
        newLibrary.add(songId);
      }
      try {
          localStorage.setItem('userLibrary', JSON.stringify(Array.from(newLibrary)));
      } catch (error) {
          console.error("Failed to save library to localStorage", error);
      }
      return newLibrary;
    });
  }, []);

  const handleToggleLike = useCallback((songId: string) => {
    const isCurrentlyLiked = likedSongs.has(songId);

    setLikedSongs(prev => {
        const newLiked = new Set(prev);
        if (isCurrentlyLiked) {
            newLiked.delete(songId);
        } else {
            newLiked.add(songId);
        }
        return newLiked;
    });

    setSongs(prevSongs => prevSongs.map(s => {
        if (s.id === songId) {
            const currentLikes = parseInt(s.likes || '0');
            const newLikes = isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
            return { ...s, likes: String(newLikes) };
        }
        return s;
    }));
  }, [likedSongs]);

  const sortSongs = (songsToSort: Song[], option: SortOption): Song[] => {
    const sorted = [...songsToSort];
    const parse = (val: string | undefined) => parseInt(val || '0', 10);
    switch (option) {
      case 'date_asc':
        return sorted.sort((a, b) => ((a.created_at || 0) > (b.created_at || 0) ? 1 : -1)); 
      case 'title_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'artist_asc':
        return sorted.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
      case 'artist_desc':
        return sorted.sort((a, b) => (b.artist || '').localeCompare(a.artist || ''));
      case 'style_asc':
        return sorted.sort((a, b) => a.style.localeCompare(b.style));
      case 'style_desc':
        return sorted.sort((a, b) => b.style.localeCompare(a.style));
      case 'duration_asc':
        return sorted.sort((a, b) => a.duration - b.duration);
      case 'duration_desc':
        return sorted.sort((a, b) => b.duration - a.duration);
      case 'plays_desc':
        return sorted.sort((a, b) => parse(b.plays) - parse(a.plays));
      case 'plays_asc':
        return sorted.sort((a, b) => parse(a.plays) - parse(b.plays));
      case 'likes_desc':
        return sorted.sort((a, b) => parse(b.likes) - parse(a.likes));
      case 'likes_asc':
        return sorted.sort((a, b) => parse(a.likes) - parse(b.likes));
      case 'comments_desc':
        return sorted.sort((a, b) => parse(b.comments) - parse(a.comments));
      case 'comments_asc':
        return sorted.sort((a, b) => parse(a.comments) - parse(b.comments));
      case 'date_desc':
      default:
        return sorted.sort((a, b) => ((a.created_at || 0) < (b.created_at || 0) ? 1 : -1));
    }
  };

  const currentPlaylist = useMemo(() => {
    const getPlaylistSource = () => {
      switch (view) {
        case 'library':
          return songs.filter(song => library.has(song.id));
        case 'search':
        default:
          return songs;
      }
    };
    
    let playlist = getPlaylistSource();

    if (styleFilter !== 'all') {
      playlist = playlist.filter(song =>
        song.style.split(',').map(s => s.trim()).includes(styleFilter)
      );
    }
    
    if (debouncedSearchQuery.trim() !== '') {
        const fuseOptions = {
            keys: ['title', 'artist', 'style'],
            threshold: 0.4, // Adjust for more or less fuzzy matching
        };
        const fuse = new Fuse(playlist, fuseOptions);
        playlist = fuse.search(debouncedSearchQuery).map(result => result.item);
    }

    return sortSongs(playlist, sortOption);
  }, [view, songs, debouncedSearchQuery, sortOption, library, styleFilter]);
  
  const togglePlay = useCallback((songId: string) => {
    // Lazy initialization of AudioContext on first user interaction
    setupAudioContext();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (currentlyPlaying === songId) {
      setIsPlaying(prev => !prev);
    } else {
      const isSongInQueue = queue.find(s => s.id === songId);

      // If the song isn't in the current queue, or the queue is empty, start a new playback session.
      if (!isSongInQueue || queue.length === 0) {
        setQueue(currentPlaylist);
        setPlayHistory([songId]); // A new playback session starts, so reset history.
      } else {
        // The song is already in the queue, so just jump to it.
        // Add to history to allow using the 'previous' button.
        setPlayHistory(p => [...p, songId]);
      }
      
      setCurrentlyPlaying(songId);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setProgress(0);

      // Add to listening history when a new song is played
      setListeningHistory(prevHistory => {
        const historyWithoutSong = prevHistory.filter(id => id !== songId);
        const newHistory = [songId, ...historyWithoutSong];
        const finalHistory = newHistory.slice(0, 20); // keep it to a reasonable size
        localStorage.setItem('listeningHistory', JSON.stringify(finalHistory));
        return finalHistory;
      });
    }
  }, [currentlyPlaying, currentPlaylist, queue, setupAudioContext]);

  const handleNextSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return;

    let nextSongId: string;

    if (isShuffling) {
        if (queue.length <= 1) return;
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * queue.length);
        } while (queue.length > 1 && queue[randomIndex].id === currentlyPlaying);
        nextSongId = queue[randomIndex].id;
    } else {
        const currentIndex = queue.findIndex(s => s.id === currentSong.id);
        if (currentIndex === -1) {
            if (queue.length > 0) {
                nextSongId = queue[0].id;
            } else {
                return;
            }
        } else {
            const nextIndex = (currentIndex + 1) % queue.length;
            nextSongId = queue[nextIndex].id;
        }
    }

    setCurrentlyPlaying(nextSongId);
    setPlayHistory(p => [...p, nextSongId]);
  }, [currentSong, queue, isShuffling, currentlyPlaying]);
  
  const handleSongEnd = useCallback(() => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    
    const currentIndex = queue.findIndex(s => s.id === currentlyPlaying);
    const isLastSong = currentIndex === queue.length - 1;

    if (isLastSong && repeatMode === 'off' && !isShuffling) {
      setIsPlaying(false);
      setProgress(currentSong?.duration || 0); // Show progress bar as full
    } else {
      handleNextSong();
    }
  }, [repeatMode, queue, currentlyPlaying, currentSong, isShuffling, handleNextSong]);

  const handlePrevSong = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (playHistory.length < 2) return;

    const newHistory = [...playHistory];
    newHistory.pop(); // remove current song from history
    const prevSongId = newHistory[newHistory.length - 1];
    
    setPlayHistory(newHistory);
    setCurrentlyPlaying(prevSongId);
  }, [playHistory]);

  const handleToggleShuffle = useCallback(() => {
    setIsShuffling(prev => !prev);
  }, []);

  const handleToggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
        if (prev === 'off') return 'all';
        if (prev === 'all') return 'one';
        return 'off';
    });
  }, []);

  const handleAddToQueue = useCallback((songId: string) => {
    const songToAdd = songs.find(s => s.id === songId);
    if (!songToAdd) return;

    if (queue.length === 0) {
        togglePlay(songId);
    } else {
        if (!queue.find(s => s.id === songToAdd.id)) {
            setQueue(prevQueue => [...prevQueue, songToAdd]);
        }
    }
  }, [songs, queue, togglePlay]);

  const handleShufflePlay = useCallback(() => {
      if (currentPlaylist.length === 0) return;
      
      setIsShuffling(true);
      setQueue(currentPlaylist);
      
      const randomSong = currentPlaylist[Math.floor(Math.random() * currentPlaylist.length)];
      
      setPlayHistory([randomSong.id]);
      setCurrentlyPlaying(randomSong.id);
      setIsPlaying(true);
      if (audioRef.current) {
          audioRef.current.currentTime = 0;
      }
      setProgress(0);
  }, [currentPlaylist]);

  const handlePlayRadio = useCallback((station: RadioStation) => {
      const stationKeywords = station.name.toLowerCase().split(' ');
      
      const radioPlaylist = songs.filter(s => {
          const styleLower = s.style.toLowerCase();
          return stationKeywords.some(keyword => styleLower.includes(keyword));
      });

      if (radioPlaylist.length === 0) {
          console.warn(`No songs found for radio station: ${station.name}`);
          // Fallback to all songs if none match
          const allShuffled = [...songs].sort(() => 0.5 - Math.random());
          setQueue(allShuffled);
          setIsShuffling(true);
          if (allShuffled.length > 0) {
            togglePlay(allShuffled[0].id);
          }
          return;
      }
      
      const shuffled = radioPlaylist.sort(() => 0.5 - Math.random());
      
      setQueue(shuffled);
      setIsShuffling(true);
      
      const firstSong = shuffled[0];
      togglePlay(firstSong.id);
      
  }, [songs, togglePlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong) {
      const isNewSong = audio.src !== currentSong.audioUrl;
      
      if (isNewSong) {
        audio.src = currentSong.audioUrl;
        audio.load(); // Explicitly load the new source
      }
      
      if (isPlaying) {
        // Attempt to play the audio. The browser will handle waiting for enough data.
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio play failed:", error);
            // If playing fails, update the state to reflect that.
            setIsPlaying(false);
          });
        }
      } else {
        audio.pause();
      }
    } else {
      // No song is selected, so make sure the player is paused.
      audio.pause();
    }
  }, [isPlaying, currentSong]);


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current && isFinite(time)) {
      const audio = audioRef.current;
      const newTime = Math.max(0, Math.min(time, audio.duration));
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    if(audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const handleSearchSubmit = useCallback(() => {
    setDebouncedSearchQuery(searchQuery); // Update immediately
    if (searchQuery.trim() !== '') {
      handleSetView('search');
    }
  }, [searchQuery, handleSetView]);

  const handleOpenFullScreenPlayer = useCallback(() => setIsFullScreenPlayerOpen(true), []);
  const handleCloseFullScreenPlayer = useCallback(() => setIsFullScreenPlayerOpen(false), []);

  const renderView = () => {
    if (isLoadingSongs) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <SpinnerIcon className="w-10 h-10 animate-spin text-purple-400" />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex-1 flex items-center justify-center text-center text-zinc-400 p-8">
                <div>
                    <h2 className="text-xl font-semibold text-red-500">Failed to Load Music</h2>
                    <p className="mt-2">{loadError}</p>
                    <p className="mt-2 text-sm">Please ensure your Supabase credentials are set correctly and the database is reachable.</p>
                </div>
            </div>
        );
    }

    const navProps = {
        onBack: handleBack,
        onForward: handleForward,
        canGoBack: canGoBack,
        canGoForward: canGoForward,
    };

    switch (view) {
      case 'home':
        return (
          <HomeView
            setView={handleSetView}
            songs={songs}
            creators={creators}
            listeningHistory={listeningHistory}
            currentlyPlaying={currentlyPlaying}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onAddToQueue={handleAddToQueue}
            onToggleFollow={handleToggleFollow}
            library={library}
            onToggleInLibrary={handleToggleInLibrary}
            currentUser={currentUser}
            likedSongs={likedSongs}
            onToggleLike={handleToggleLike}
          />
        );
      case 'create':
        return (
          <CreateView 
            addSong={addSong}
            songs={songs.filter(s => s.artist === currentUser.name)}
            currentlyPlaying={currentlyPlaying}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onAddToQueue={handleAddToQueue}
            currentUser={currentUser}
          />
        );
      case 'library':
        return (
          <LibraryView 
            songs={currentPlaylist} 
            currentlyPlaying={currentlyPlaying} 
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            sortOption={sortOption}
            onSortOptionChange={handleSortOptionChange}
            onAddToQueue={handleAddToQueue}
            onShufflePlay={handleShufflePlay}
            onEditSong={handleOpenEditModal}
            onDeleteSong={handleDeleteSong}
            library={library}
            onToggleInLibrary={handleToggleInLibrary}
            currentUser={currentUser}
            allStyles={allStyles}
            styleFilter={styleFilter}
            onStyleFilterChange={setStyleFilter}
            {...navProps}
          />
        );
       case 'explore':
        return (
          <ExploreView
            currentlyPlaying={currentlyPlaying}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onAddToQueue={handleAddToQueue}
            library={library}
            onToggleInLibrary={handleToggleInLibrary}
            likedSongs={likedSongs}
            onToggleLike={handleToggleLike}
            creators={creators}
            onToggleFollow={handleToggleFollow}
            {...navProps}
          />
        );
      case 'radio':
        return (
          <RadioView 
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onPlayStation={handlePlayRadio}
            {...navProps}
          />
        );
      case 'search': {
        return (
          <SearchResultView
            songs={currentPlaylist}
            currentlyPlaying={currentlyPlaying}
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            query={searchQuery}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            sortOption={sortOption}
            onSortOptionChange={handleSortOptionChange}
            onAddToQueue={handleAddToQueue}
            onShufflePlay={handleShufflePlay}
            onEditSong={handleOpenEditModal}
            onDeleteSong={handleDeleteSong}
            library={library}
            onToggleInLibrary={handleToggleInLibrary}
            currentUser={currentUser}
            likedSongs={likedSongs}
            onToggleLike={handleToggleLike}
            allStyles={allStyles}
            styleFilter={styleFilter}
            onStyleFilterChange={setStyleFilter}
            {...navProps}
          />
        );
      }
      case 'profile':
        return (
          <ProfileView 
            user={currentUser}
            songs={songs.filter(s => s.artist === currentUser.name)}
            currentlyPlaying={currentlyPlaying}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onAddToQueue={handleAddToQueue}
            onShufflePlay={handleShufflePlay}
            onEditSong={handleOpenEditModal}
            onDeleteSong={handleDeleteSong}
            onUpdateUser={handleUpdateUser}
            library={library}
            onToggleInLibrary={handleToggleInLibrary}
            likedSongs={likedSongs}
            onToggleLike={handleToggleLike}
          />
        );
      case 'notifications':
        return (
            <NotificationsView
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onDeleteNotification={handleDeleteNotification}
            />
        );
      case 'upgrade':
        return (
            <UpgradeView
                user={currentUser}
                onUpgrade={handleUpgrade}
                onOpenBuyCreditsModal={handleOpenBuyCreditsModal}
            />
        );
      case 'whats_new':
        return (
            <WhatsNewView posts={whatsNewPosts} />
        );
      case 'more_from_moji':
        return (
            <MoreFromMojiView />
        );
      default:
        return <HomeView setView={handleSetView} songs={songs} creators={creators} listeningHistory={listeningHistory} currentlyPlaying={currentlyPlaying} isPlaying={isPlaying} togglePlay={togglePlay} onAddToQueue={handleAddToQueue} onToggleFollow={handleToggleFollow} library={library} onToggleInLibrary={handleToggleInLibrary} currentUser={currentUser} likedSongs={likedSongs} onToggleLike={handleToggleLike}/>;
    }
  };
  
  const songToEdit = useMemo(() => editingSongId ? songs.find(s => s.id === editingSongId) : null, [editingSongId, songs]);

  return (
    <div className="flex h-screen bg-zinc-900 text-white font-sans">
      <Sidebar 
        currentView={view} 
        setView={handleSetView} 
        user={currentUser}
        unreadCount={unreadNotificationsCount}
        whatsNewCount={whatsNewCount}
        onOpenBuyCreditsModal={handleOpenBuyCreditsModal}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto flex flex-col">
          {renderView()}
        </main>
        {currentSong && (
          <Player
            song={currentSong}
            isPlaying={isPlaying}
            progress={progress}
            volume={volume}
            isShuffling={isShuffling}
            repeatMode={repeatMode}
            onPlayPause={() => togglePlay(currentSong.id)}
            onNext={handleNextSong}
            onPrev={handlePrevSong}
            onSeek={handleSeek}
            onVolumeChange={(e) => handleVolumeChange(Number(e.target.value))}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
            analyser={analyserRef.current}
            onExpand={handleOpenFullScreenPlayer}
          />
        )}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSongEnd}
          className="hidden"
          crossOrigin="anonymous"
        />
      </div>
      {songToEdit && (
        <EditSongModal
          song={songToEdit}
          onSave={handleSaveSong}
          onClose={handleCloseEditModal}
          onDelete={handleDeleteSong}
        />
      )}
      {currentSong && isFullScreenPlayerOpen && (
        <FullScreenPlayer
            song={currentSong}
            isPlaying={isPlaying}
            progress={progress}
            volume={volume}
            isShuffling={isShuffling}
            repeatMode={repeatMode}
            onPlayPause={() => togglePlay(currentSong.id)}
            onNext={handleNextSong}
            onPrev={handlePrevSong}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
            onClose={handleCloseFullScreenPlayer}
            analyser={analyserRef.current}
            isLiked={likedSongs.has(currentSong.id)}
            onToggleLike={() => handleToggleLike(currentSong.id)}
            visualizerStyle={visualizerStyle}
            onSetVisualizerStyle={setVisualizerStyle}
            colorTheme={colorTheme}
            onSetColorTheme={setColorTheme}
        />
      )}
      {isBuyCreditsModalOpen && (
        <BuyCreditsModal
          onClose={handleCloseBuyCreditsModal}
          onPurchase={handlePurchaseCredits}
        />
      )}
    </div>
  );
};

export default App;