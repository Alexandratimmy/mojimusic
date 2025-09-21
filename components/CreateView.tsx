import React, { useState } from 'react';
import type { Song, User } from '../types';
import { generateSongDetails, generateAlbumArt, generateLyrics } from '../services/geminiService';
import { SparklesIcon, SpinnerIcon, AdvancedOptionsIcon, ChevronDownIcon } from './icons';
import HistorySongItem from './HistorySongItem';

interface CreateViewProps {
  addSong: (song: Omit<Song, 'id'>) => void;
  songs: Song[];
  currentlyPlaying: string | null;
  isPlaying: boolean;
  togglePlay: (songId: string) => void;
  onAddToQueue: (songId: string) => void;
  currentUser: User;
}

const Tag: React.FC<{ onClick: (text: string) => void; children: React.ReactNode; }> = ({ onClick, children }) => (
    <button onClick={() => onClick(children as string)} className="bg-zinc-700 text-zinc-300 px-3 py-1 rounded-full text-xs hover:bg-zinc-600 transition-colors">
        {children}
    </button>
);


const CreateView: React.FC<CreateViewProps> = ({ addSong, songs, currentlyPlaying, isPlaying, togglePlay, onAddToQueue, currentUser }) => {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('');
  const [title, setTitle] = useState('');
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [duration, setDuration] = useState(180); // 3 mins
  const [tempo, setTempo] = useState(120);
  const [musicalKey, setMusicalKey] = useState('C Major');

  const musicalKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].flatMap(key => [`${key} Major`, `${key} Minor`]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleGenerateLyrics = async () => {
    setIsGeneratingLyrics(true);
    setError(null);
    try {
        const generated = await generateLyrics(style);
        setLyrics(generated);
    } catch(err: any) {
        setError(err.message || 'Failed to generate lyrics.');
    } finally {
        setIsGeneratingLyrics(false);
    }
  };

  const handleTagClick = (tagText: string) => {
    setStyle(prev => {
        if (!prev) return tagText;
        const parts = prev.split(',').map(p => p.trim());
        if (parts.includes(tagText)) return prev; // Avoid duplicates
        return `${prev}, ${tagText}`;
    });
  };

  const handleCreate = async () => {
    if (!style && !lyrics && !isInstrumental) {
      setError('Please provide lyrics or a style description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setLoadingStep('Generating song details...');
      const details = await generateSongDetails(lyrics, style, isInstrumental, title, duration, tempo, musicalKey);
      
      setLoadingStep('Creating album art...');
      const finalTitle = title.trim() || details.title;
      const albumArtUrl = await generateAlbumArt(details.albumArtPrompt || `Album art for a song titled "${finalTitle}" with the style ${details.style}`);

      const newSong: Omit<Song, 'id'> = {
        title: finalTitle || 'Untitled Song',
        description: details.description || 'No description available.',
        style: details.style || 'Custom',
        duration: details.duration || 180,
        albumArtUrl: albumArtUrl,
        version: 'v4.5+',
        audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/you_will_be_great.mp3',
        artist: currentUser.name,
        lyrics: isInstrumental ? '(Instrumental)' : lyrics,
      };
      addSong(newSong);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="flex h-full bg-zinc-900">
      {/* Left Panel: Creation Form */}
      <div className="flex-[3] p-8 border-r border-zinc-800 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Song Studio</h1>

            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 space-y-6">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-zinc-300">Song Title (Optional)</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Electric Dreams"
                  className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="lyrics" className="text-sm font-medium text-zinc-300">Lyrics</label>
                    <button
                        onClick={handleGenerateLyrics}
                        className="flex items-center gap-2 text-xs text-purple-400 font-semibold hover:text-purple-300 disabled:text-zinc-500 disabled:cursor-not-allowed"
                        disabled={isGeneratingLyrics || isLoading}
                    >
                        {isGeneratingLyrics
                            ? <SpinnerIcon className="animate-spin h-4 w-4" />
                            : <SparklesIcon className="w-4 h-4" />
                        }
                        <span>Generate Lyrics</span>
                    </button>
                </div>
                <textarea
                  id="lyrics"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="A lone wolf howling at a synthwave moon..."
                  className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  disabled={isLoading || isInstrumental}
                />
                 <div className="flex items-center justify-end gap-3 mt-2">
                  <label htmlFor='instrumental-toggle' className="text-sm font-medium text-zinc-300">Instrumental</label>
                  <button
                      id="instrumental-toggle"
                      onClick={() => setIsInstrumental(!isInstrumental)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                          isInstrumental ? 'bg-purple-600' : 'bg-zinc-700'
                      }`}
                      disabled={isLoading}
                      aria-pressed={isInstrumental}
                  >
                      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          isInstrumental ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
              </div>
              </div>

              <div>
                <label htmlFor="style" className="text-sm font-medium text-zinc-300 block">Style & Mood</label>
                <p className="text-xs text-zinc-500 mb-2">e.g., epic cinematic, lo-fi hip hop, acoustic folk ballad</p>
                <textarea
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="Describe the sound and feel of your song..."
                    className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    disabled={isLoading}
                />
                 <div className="flex flex-wrap gap-2 mt-3">
                  <Tag onClick={handleTagClick}>indie rock</Tag>
                  <Tag onClick={handleTagClick}>pop</Tag>
                  <Tag onClick={handleTagClick}>synthwave</Tag>
                  <Tag onClick={handleTagClick}>acoustic</Tag>
                  <Tag onClick={handleTagClick}>fast</Tag>
              </div>
              </div>
              
               <div className="border-t border-zinc-700 pt-6">
                  <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex justify-between items-center w-full text-left" aria-expanded={showAdvanced}>
                      <span className="flex items-center gap-3">
                          <AdvancedOptionsIcon />
                          <span className="text-sm font-medium text-zinc-300">Advanced Options</span>
                      </span>
                      <ChevronDownIcon className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                  {showAdvanced && (
                      <div className="mt-6 space-y-6">
                          {/* Duration Slider */}
                          <div>
                              <label htmlFor="duration" className="flex justify-between text-sm font-medium text-zinc-300 mb-2">
                                  <span>Song Length</span>
                                  <span className="font-mono">{formatDuration(duration)}</span>
                              </label>
                              <input
                                  id="duration"
                                  type="range"
                                  min="30"
                                  max="360"
                                  step="5"
                                  value={duration}
                                  onChange={(e) => setDuration(Number(e.target.value))}
                                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
                                  disabled={isLoading}
                              />
                          </div>

                          {/* Tempo Slider */}
                          <div>
                              <label htmlFor="tempo" className="flex justify-between text-sm font-medium text-zinc-300 mb-2">
                                  <span>Tempo (BPM)</span>
                                  <span className="font-mono">{tempo} BPM</span>
                              </label>
                              <input
                                  id="tempo"
                                  type="range"
                                  min="60"
                                  max="180"
                                  step="1"
                                  value={tempo}
                                  onChange={(e) => setTempo(Number(e.target.value))}
                                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
                                  disabled={isLoading}
                              />
                          </div>

                          {/* Musical Key Dropdown */}
                          <div>
                              <label htmlFor="musicalKey" className="text-sm font-medium text-zinc-300 mb-2 block">Musical Key</label>
                              <select
                                  id="musicalKey"
                                  value={musicalKey}
                                  onChange={(e) => setMusicalKey(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  disabled={isLoading}
                              >
                                  {musicalKeys.map(key => <option key={key} value={key}>{key}</option>)}
                              </select>
                          </div>
                      </div>
                  )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            
            <button
              onClick={handleCreate}
              className="w-full mt-6 bg-purple-600 text-white font-semibold py-3 rounded-full hover:bg-purple-700 transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                    <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    <span>{loadingStep || 'Generating...'}</span>
                </>
              ) : (
                'Create'
              )}
            </button>
        </div>
      </div>

      {/* Right Panel: History */}
      <div className="flex-[2] p-6 overflow-y-auto">
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-white sticky top-0 bg-zinc-900 py-2">Generation History</h2>
            <div className="space-y-3">
            {songs.length > 0 ? (
                songs.map((song) => (
                <HistorySongItem
                    key={song.id}
                    song={song}
                    isPlaying={currentlyPlaying === song.id && isPlaying}
                    onPlayPause={() => togglePlay(song.id)}
                    onAddToQueue={onAddToQueue}
                />
                ))
            ) : (
                <div className="text-center text-zinc-500 mt-16 border-2 border-dashed border-zinc-700 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-zinc-300">Your creations will appear here</h3>
                <p className="mt-2 text-sm">Start by writing some lyrics or describing a style, then click 'Create'.</p>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateView;