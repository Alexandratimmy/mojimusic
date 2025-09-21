import React from 'react';
import Header from './Header';
import type { Notification } from '../types';
import { BellIcon, UserIcon, HeartIcon, CloseIcon } from './icons';

interface NotificationsViewProps {
    notifications: Notification[];
    onMarkAllRead: () => void;
    onDeleteNotification: (id: string) => void;
}

const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return Math.floor(seconds) + "s";
};

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch(type) {
        case 'new_follower': return <UserIcon className="w-5 h-5 text-blue-400" />;
        case 'song_liked': return <HeartIcon className="w-5 h-5 text-red-400" />;
        case 'new_release': return <BellIcon className="w-5 h-5 text-purple-400" />;
        default: return <BellIcon className="w-5 h-5 text-zinc-400" />;
    }
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications, onMarkAllRead, onDeleteNotification }) => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 shrink-0">
            <h1 className="text-lg font-semibold">Notifications</h1>
            <button
                onClick={onMarkAllRead}
                className="text-sm font-semibold text-purple-400 hover:text-purple-300 disabled:text-zinc-500"
                disabled={notifications.every(n => n.read)}
            >
                Mark all as read
            </button>
        </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className={`group flex items-start gap-4 p-4 rounded-lg transition-colors ${!notification.read ? 'bg-zinc-800/70' : 'bg-transparent'}`}>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 shrink-0"></div>}
                    <div className={`shrink-0 ${notification.read ? 'ml-4' : ''}`}>
                       {notification.from ? (
                           <img src={notification.from.imageUrl} alt={notification.from.name} className="w-8 h-8 rounded-full" />
                       ) : (
                           <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                               <NotificationIcon type={notification.type} />
                           </div>
                       )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-zinc-200">{notification.message}</p>
                        <p className="text-xs text-zinc-400 mt-1">{timeSince(notification.timestamp)} ago</p>
                    </div>
                    <button
                        onClick={() => onDeleteNotification(notification.id)}
                        className="ml-auto p-1 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Delete notification: ${notification.message}`}
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-zinc-400 py-20">
                <BellIcon className="w-12 h-12 mx-auto text-zinc-500" />
                <h2 className="mt-4 text-lg font-semibold">No notifications yet</h2>
                <p className="mt-1 text-sm">We'll let you know when something new happens.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;