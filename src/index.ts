import { Server } from './server';
import { TelegramBotService } from './bot';
import { LocalJSONStorage } from './storage';
import { FavoriteService } from './service/favorite';
import { InitializationError } from './exceptions';
import { token, port, webhookUrl, dbPath } from './config';

async function main() {
    const storage = new LocalJSONStorage(dbPath);
    const favoriteService = new FavoriteService();

    await favoriteService.setStorage(storage);
    if (!favoriteService.isInitialized()) {
        throw new InitializationError('FavoriteService not initialized');
    }

    const telegramService = new TelegramBotService(token as string, favoriteService);
    new Server(telegramService).start(Number(port), webhookUrl);
}

main().catch((error) => {
    console.error('Fatal error during initialization:', error);
    process.exit(1);
});
