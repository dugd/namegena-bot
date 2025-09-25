import type { FavoriteEntry, Favorites } from './types/storage';

export function isFavoriteEntry(obj: any): obj is FavoriteEntry {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.name_1 === 'string' &&
        typeof obj.name_2 === 'string' &&
        typeof obj.result === 'string' &&
        typeof obj.created_at === 'string'
    );
}

export function isFavorites(obj: any): obj is Favorites {
    if (!obj || typeof obj !== 'object') return false;
    return Object.values(obj).every(
        (entries) => Array.isArray(entries) && entries.every((entry) => isFavoriteEntry(entry)),
    );
}
