
import React from 'react';
import Header from './Header';
import type { RadioStation } from '../types';
import { radioStations } from '../constants';
import { PlayIcon } from './icons';

interface RadioStationCardProps {
  station: RadioStation;
  onPlay: () => void;
}

const RadioStationCard: React.FC<RadioStationCardProps> = ({ station, onPlay }) => {
  return (
    <div className="bg-zinc-800/50 rounded-lg overflow-hidden group transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="relative">
        <img src={station.imageUrl} alt={station.name} className="w-full h-48 object-cover" />
        <button 
          onClick={onPlay}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Play ${station.name}`}
        >
          <PlayIcon className="w-8 h-8" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-white truncate">{station.name}</h3>
        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{station.description}</p>
      </div>
    </div>
  );
};

interface RadioViewProps {
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearchSubmit: () => void;
    onPlayStation: (station: RadioStation) => void;
    onBack?: () => void;
    onForward?: () => void;
    canGoBack?: boolean;
    canGoForward?: boolean;
}

const RadioView: React.FC<RadioViewProps> = ({ searchQuery, onSearchQueryChange, onSearchSubmit, onPlayStation, onBack, onForward, canGoBack, canGoForward }) => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
      <Header 
        title="Radio"
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onSearchSubmit={onSearchSubmit}
        onBack={onBack}
        onForward={onForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {radioStations.map((station) => (
            <RadioStationCard key={station.id} station={station} onPlay={() => onPlayStation(station)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadioView;
