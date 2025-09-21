import { supabase } from './supabaseClient';
import type { Song } from '../types';

// Helper to convert snake_case keys from Supabase to camelCase for the app
const toCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.replace(/([-_][a-z])/ig, ($1) => {
                return $1.toUpperCase().replace('-', '').replace('_', '');
            });
            result[camelKey] = toCamelCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
};

// Helper to convert camelCase keys from the app to snake_case for Supabase
const toSnakeCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            result[snakeKey] = toSnakeCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
};

export const getSongs = async (): Promise<Song[]> => {
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching songs:", error);
        throw new Error(error.message);
    }
    
    return toCamelCase(data) as Song[];
};

export const addSong = async (song: Omit<Song, 'id' | 'created_at'>): Promise<Song> => {
    const { data, error } = await supabase
        .from('songs')
        .insert([toSnakeCase(song)])
        .select()
        .single(); // Use .single() to get a single object back, not an array

    if (error) {
        console.error("Error adding song:", error);
        throw new Error(error.message);
    }

    return toCamelCase(data) as Song;
};

export const updateSong = async (song: Partial<Song> & { id: string }): Promise<Song> => {
    const { id, ...updateData } = song;
    const { data, error } = await supabase
        .from('songs')
        .update(toSnakeCase(updateData))
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error("Error updating song:", error);
        throw new Error(error.message);
    }
    
    return toCamelCase(data) as Song;
};

export const deleteSong = async (songId: string): Promise<void> => {
    const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

    if (error) {
        console.error("Error deleting song:", error);
        throw new Error(error.message);
    }
};
