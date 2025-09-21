


export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  description: string;
  style: string;
  duration: number; // in seconds
  albumArtUrl: string;
  version: string;
  audioUrl: string;
  lyrics?: string | LyricLine[] | null;
  artist?: string;
  plays?: string;
  likes?: string;
  comments?: string;
  created_at?: string;
}

export type View = 'home' | 'create' | 'library' | 'search' | 'explore' | 'radio' | 'profile' | 'notifications' | 'upgrade' | 'whats_new' | 'more_from_moji';

export type SortOption = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc' | 'duration_desc' | 'duration_asc' | 'plays_desc' | 'plays_asc' | 'likes_desc' | 'likes_asc' | 'comments_desc' | 'comments_asc' | 'artist_asc' | 'artist_desc' | 'style_asc' | 'style_desc';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  followers: number;
  imageUrl: string;
  isFollowing: boolean;
}

export interface User extends Creator {
    following: number;
    credits: number;
    plan: 'Free' | 'Pro' | 'Premium';
}

export type NotificationType = 'new_follower' | 'song_liked' | 'new_release';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: string; // ISO string
    read: boolean;
    from?: {
        name: string;
        imageUrl: string;
    }
}

export interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  songs?: number;
  plays?: string;
  likes?: string;
  gradient: string;
}

export interface RadioStation {
  id:string;
  name: string;
  description: string;
  imageUrl: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface UpdatePost {
    id: string;
    version: string;
    date: string;
    title: string;
    description: string;
}

export type VisualizerStyle = 'circular' | 'bars' | 'wave' | 'off';
export type ColorTheme = 'purple_haze' | 'oceanic' | 'sunset' | 'monochrome';