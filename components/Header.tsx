

import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, ChevronDownIcon, LeftArrowIcon, RightArrowIcon, ShuffleIcon } from './icons';
import type { SortOption } from '../types';

interface HeaderProps {
  title: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  sortOption?: SortOption;
  onSortOptionChange?: (option: SortOption) => void;
  allStyles?: string[];
  styleFilter?: string;
  onStyleFilterChange?: (style: string) => void;
  onShufflePlay?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date_desc', label: 'Date Added (Newest)' },
    { value: 'date_asc', label: 'Date Added (Oldest)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
    { value: 'artist_asc', label: 'Artist (A-Z)' },
    { value: 'artist_desc', label: 'Artist (Z-A)' },
    { value: 'style_asc', label: 'Style (A-Z)' },
    { value: 'style_desc', label: 'Style (Z-A)' },
    { value: 'duration_desc', label: 'Duration (Longest)' },
    { value: 'duration_asc', label: 'Duration (Shortest)' },
    { value: 'plays_desc', label: 'Plays (Most)' },
    { value: 'plays_asc', label: 'Plays (Fewest)' },
    { value: 'likes_desc', label: 'Likes (Most)' },
    { value: 'likes_asc', label: 'Likes (Fewest)' },
    { value: 'comments_desc', label: 'Comments (Most)' },
    { value: 'comments_asc', label: 'Comments (Fewest)' },
];

const Header: React.FC<HeaderProps> = ({ title, searchQuery, onSearchQueryChange, onSearchSubmit, sortOption, onSortOptionChange, allStyles, styleFilter, onStyleFilterChange, onShufflePlay, onBack, onForward, canGoBack, canGoForward }) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const styleDropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(event.target as Node)) {
        setIsStyleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentSortLabel = sortOptions.find(o => o.value === sortOption)?.label || 'Sort by...';
  const currentStyleLabel = styleFilter === 'all' || !styleFilter ? 'All Styles' : styleFilter;


  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-zinc-500 hover:text-white disabled:text-zinc-700 disabled:cursor-not-allowed" disabled={!canGoBack}><LeftArrowIcon /></button>
            <button onClick={onForward} className="text-zinc-500 hover:text-white disabled:text-zinc-700 disabled:cursor-not-allowed" disabled={!canGoForward}><RightArrowIcon /></button>
        </div>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {onShufflePlay && (
            <button
                onClick={onShufflePlay}
                className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-700 transition-colors text-sm"
            >
                <ShuffleIcon className="w-4 h-4"/>
                <span>Shuffle Play</span>
            </button>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>
         {onStyleFilterChange && styleFilter && allStyles && (
            <div className="relative" ref={styleDropdownRef}>
                <button
                    onClick={() => setIsStyleDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-sm hover:bg-zinc-700 w-48 justify-between capitalize"
                >
                    <span>{currentStyleLabel}</span>
                    <ChevronDownIcon />
                </button>
                {isStyleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                        <ul className="py-1">
                            {allStyles.map(style => (
                                <li key={style}>
                                    <button
                                        onClick={() => {
                                            onStyleFilterChange(style);
                                            setIsStyleDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 capitalize"
                                    >
                                        {style === 'all' ? 'All Styles' : style}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}
        {onSortOptionChange && sortOption && (
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setIsSortDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-sm hover:bg-zinc-700 w-48 justify-between"
            >
              <span>{currentSortLabel}</span>
              <ChevronDownIcon />
            </button>
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {sortOptions.map(option => (
                    <li key={option.value}>
                      <button
                        onClick={() => {
                          onSortOptionChange(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;