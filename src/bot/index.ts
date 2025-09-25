import TelegramBot from 'node-telegram-bot-api';
import { commands } from './commands';
import type { LocalJSONStorage } from '../storage';
import type { BotContext } from '../types/bot';

export class TelegramBotService {
    private bot: TelegramBot;
    private storage?: LocalJSONStorage;

    public setStorage(storage: LocalJSONStorage): void {
        this.storage = storage;
    }

    constructor(token: string) {
        this.bot = new TelegramBot(token, { polling: false });

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
            if (!msg) {
                await this.bot.answerCallbackQuery(query.id, { text: 'Invalid message.' });
                return;
            }

            if (data && data.startsWith('save:')) {
                const parts = data.split(':');
                if (parts.length === 4) {
                    const name1 = parts[1] as string;
                    const name2 = parts[2] as string;
                    const result = parts[3] as string;

                    if (!this.storage) {
                        await this.bot.sendMessage(msg.chat.id, 'Cannot save favorite.');
                        console.error('Storage not set. Cannot save favorite.');
                        return;
                    }

                    const data = (await this.storage.readData()) || {};
                    const chatId = String(query.message?.chat.id);
                    if (!data[chatId]) {
                        data[chatId] = [];
                    }
                    if (data[chatId].length >= 10) {
                        await this.bot.sendMessage(
                            msg.chat.id,
                            'You have reached the limit of 10 favorite entries.',
                        );
                        return;
                    }
                    if (
                        data[chatId].some(
                            (entry) =>
                                entry.name_1 === name1 &&
                                entry.name_2 === name2 &&
                                entry.result === result,
                        )
                    ) {
                        await this.bot.sendMessage(msg.chat.id, 'This favorite already exists.');
                        return;
                    }
                    data[chatId].push({
                        name_1: name1,
                        name_2: name2,
                        result,
                        created_at: new Date().toISOString(),
                    });
                    await this.storage.writeData(data);
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
