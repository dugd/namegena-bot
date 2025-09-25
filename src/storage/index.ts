import path from 'path';
import { promises as fs } from 'fs';
import { Favorites } from '../types/storage';
import { isFavorites } from '../guard';
import { DataFormatError } from '../exceptions';

export class LocalJSONStorage {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async readData(): Promise<Favorites | null> {
        try {
            try {
                await fs.stat(this.filePath);
            } catch {
                throw new Error('File does not exist');
            }
            const data = JSON.parse(await fs.readFile(this.filePath, 'utf-8'));
            if (!isFavorites(data)) {
                throw new DataFormatError('Data format is invalid');
            }
            return data;
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }

    public async writeData(data: Favorites): Promise<boolean> {
        try {
            await fs.mkdir(path.dirname(this.filePath), { recursive: true });
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
            return true;
        } catch (error) {
            console.error('Error writing data:', error);
            return false;
        }
    }
}
