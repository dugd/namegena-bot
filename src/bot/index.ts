import TelegramBot from 'node-telegram-bot-api';
import { commands } from './commands';
import { FavoriteService } from '../service/favorite';
import type { BotContext } from '../types/bot';
import { LimitationResourceError, AlreadtyExistsError } from '../exceptions';

export class TelegramBotService {
    private bot: TelegramBot;
    private service: FavoriteService;

    constructor(token: string, service: FavoriteService) {
        this.bot = new TelegramBot(token, { polling: false });
        this.service = service;

        this.setupCommands();
        this.setupHandlers();
    }

    private setupCommands(): void {
        const botCommands = commands.map((cmd) => ({
            command: cmd.command,
            description: cmd.description,
        }));
        this.bot.setMyCommands(botCommands);

        commands.forEach((cmd) => {
            if (cmd.pattern) {
                this.bot.onText(cmd.pattern, async (msg, match) => {
                    await this.handleCommand(msg, cmd.handler, match);
                });
            } else {
                this.bot.onText(new RegExp(`^/${cmd.command}$`), async (msg) => {
                    await this.handleCommand(msg, cmd.handler, null);
                });
            }
        });
    }

    private handleCommand(
        message: TelegramBot.Message,
        handler: Function,
        match?: RegExpExecArray | null,
    ): void {
        const ctx: BotContext = {
            message,
            from: message.from,
            chat: message.chat,
            service: this.service,
            reply: (text: string, options?: any) =>
                this.bot.sendMessage(message.chat.id, text, options),
        };
        handler(ctx, match).catch((err: Error) => {
            console.error('Error handling command:', err);
        });
    }

    private setupHandlers(): void {
        this.bot.on('message', (msg) => {
            console.log('Received message:', msg.text);
        });
        this.bot.on('callback_query', async (query) => {
            const data = query.data;
            const msg = query.message;
            if (!msg || !msg.from) {
                await this.bot.answerCallbackQuery(query.id, { text: 'Invalid message.' });
                return;
            }
            const userId = String(query.from.id);

            if (data && data.startsWith('save:')) {
                const parts = data.split(':');
                if (parts.length === 4) {
                    const name1 = parts[1] as string;
                    const name2 = parts[2] as string;
                    const result = parts[3] as string;

                    if (!this.service.isInitialized()) {
                        await this.bot.sendMessage(msg.chat.id, 'Cannot save favorite.');
                        await this.bot.answerCallbackQuery(query.id, {
                            text: 'Error occurred.',
                        });
                        console.error('Storage not set. Cannot save favorite.');
                        return;
                    }
                    try {
                        await this.service.addFavorite(userId, {
                            name_1: name1,
                            name_2: name2,
                            result,
                        });
                    } catch (err) {
                        if (
                            err instanceof LimitationResourceError ||
                            err instanceof AlreadtyExistsError
                        ) {
                            await this.bot.sendMessage(msg.chat.id, err.message);
                        } else {
                            await this.bot.sendMessage(msg.chat.id, 'Error saving favorite.');
                            console.error('Error saving favorite:', err);
                        }
                        await this.bot.answerCallbackQuery(query.id, { text: 'Error occurred.' });
                        return;
                    }
                    await this.bot.sendMessage(msg.chat.id, 'Favorite saved!');
                }
            }
            await this.bot.answerCallbackQuery(query.id, { text: 'Action received.' });
        });
    }

    public getBot(): TelegramBot {
        return this.bot;
    }

    public async setWebhook(webhookUrl: string): Promise<void> {
        await this.bot.setWebHook(webhookUrl);
    }
}
