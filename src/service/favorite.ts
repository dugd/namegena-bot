import type { FavoriteEntryInput, FavoriteEntry, Favorites } from '../types/storage';
import type { LocalJSONStorage } from '../storage';
import { InitializationError, LimitationResourceError, AlreadtyExistsError } from '../exceptions';

export class FavoriteService {
    private storage?: LocalJSONStorage;
    private data: Favorites = {};
    private isDataLoaded: boolean = false;

    public constructor() {}

    public async setStorage(storage: LocalJSONStorage): Promise<void> {
        this.storage = storage;
        await this.loadData();
    }

    public isInitialized(): boolean {
        return this.isDataLoaded;
    }

    private async loadData(): Promise<void> {
        if (!this.storage) throw new InitializationError('Storage not set');
        const storedData = await this.storage.readData();
        if (storedData) {
            this.data = storedData;
        }
        this.isDataLoaded = true;
    }

    private async saveData(): Promise<boolean> {
        if (!this.storage) throw new InitializationError('Storage not set');
        return this.storage.writeData(this.data);
    }

    public async addFavorite(userId: string, entry: FavoriteEntryInput): Promise<boolean> {
        if (!this.storage) throw new InitializationError('Storage not set');
        const newEntry: FavoriteEntry = {
            ...entry,
            created_at: new Date().toISOString(),
        };
        if (!this.data[userId]) {
            this.data[userId] = [];
        }
        if (this.data[userId].length >= 10) {
            throw new LimitationResourceError('Maximum of 10 favorites reached.');
        }
        if (
            this.data[userId].some(
                (ent) =>
                    ent.name_1 === entry.name_1 &&
                    ent.name_2 === entry.name_2 &&
                    ent.result === entry.result,
            )
        ) {
            throw new AlreadtyExistsError('Duplicate favorite entry.');
        }

        this.data[userId].push(newEntry);
        return this.saveData();
    }

    public async getFavorites(userId: string): Promise<FavoriteEntry[]> {
        if (!this.storage) throw new InitializationError('Storage not set');

        return this.data[userId] || [];
    }
}
