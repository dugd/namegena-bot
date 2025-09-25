export interface FavoriteEntry {
    name_1: string;
    name_2: string;
    result: string;
    created_at: string;
}

export interface Favorites {
    [userId: string]: FavoriteEntry[];
}
