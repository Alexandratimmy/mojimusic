import React from 'react';
import { HomeIcon, CreateIcon, LibraryIcon, SearchIcon, ExploreIcon, RadioIcon, MoreHorizontalIcon, DiscordIcon, XIcon, TikTokIcon, UserIcon, BellIcon, StandingMicIcon } from './icons';
import type { View, User } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View, isNavigating?: boolean) => void;
  user: User;
  unreadCount: number;
  whatsNewCount: number;
  onOpenBuyCreditsModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, unreadCount, whatsNewCount, onOpenBuyCreditsModal }) => {
  const navItems = [
    { name: 'Home', icon: <HomeIcon />, view: 'home' as View },
    { name: 'Create', icon: <CreateIcon />, view: 'create' as View},
    { name: 'Library', icon: <LibraryIcon />, view: 'library' as View },
    { name: 'Profile', icon: <UserIcon />, view: 'profile' as View },
    { name: 'Explore', icon: <ExploreIcon />, view: 'explore' as View},
    { name: 'Radio', icon: <RadioIcon />, view: 'radio' as View },
    { name: 'Notifications', icon: <BellIcon />, view: 'notifications' as View, badge: unreadCount },
  ];

  return (
    <aside className="w-64 bg-black p-4 flex flex-col h-full shrink-0">
      <div className="mb-10 px-2 text-center">
        <div className="flex items-center justify-center text-5xl font-bold text-white" aria-label="MOJI">
          <span aria-hidden="true" className="tracking-wider">MOJ</span>
          <StandingMicIcon className="h-12 w-5" style={{ marginLeft: '0.05em' }} aria-hidden="true" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800 mb-6">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
            <img src={user.imageUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
        </div>
        <div>
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-zinc-400">{user.handle}</p>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setView(item.view)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === item.view
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
            {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <button
        onClick={() => setView('create')}
        className="flex items-center justify-center gap-2 mt-4 w-full bg-purple-600 text-white font-semibold py-2 rounded-full hover:bg-purple-700 transition-colors"
      >
        <CreateIcon />
        <span>Create</span>
      </button>
      
      <div className="mt-auto pt-6 border-t border-zinc-800">
        <div className="p-3 rounded-lg bg-zinc-800 mb-4">
            <p className="text-sm font-semibold">{user.credits.toLocaleString()} Credits</p>
            <div className="flex gap-2 mt-2">
                <button onClick={() => setView('upgrade')} className="w-full bg-zinc-700 text-white text-sm py-1.5 rounded-md hover:bg-zinc-600 transition-colors">Upgrade</button>
                <button onClick={onOpenBuyCreditsModal} className="w-full bg-purple-600 text-white text-sm py-1.5 rounded-md hover:bg-purple-700 transition-colors">Buy</button>
            </div>
        </div>
        
        <button onClick={() => setView('whats_new')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white">
            What's new? 
            {whatsNewCount > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{whatsNewCount}</span>
            )}
        </button>
        <button onClick={() => setView('more_from_moji')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <MoreHorizontalIcon /> More from Moji
        </button>
        <div className="flex items-center justify-start gap-4 px-3 mt-4">
            <a href="#" className="text-zinc-500 hover:text-white"><XIcon /></a>
            <a href="#" className="text-zinc-500 hover:text-white"><TikTokIcon /></a>
            <a href="#" className="text-zinc-500 hover:text-white"><DiscordIcon /></a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;