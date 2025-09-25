import { Server } from './server';
import { TelegramBotService } from './bot';
import { LocalJSONStorage } from './storage';
import { token, port, webhookUrl, dbPath } from './config';

const storage = new LocalJSONStorage(dbPath);
const telegramService = new TelegramBotService(token as string);
telegramService.setStorage(storage);

new Server(telegramService).start(Number(port), webhookUrl);
