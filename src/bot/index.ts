import TelegramBot from 'node-telegram-bot-api';
import { commands } from './commands';
import type { BotContext } from '../types/bot';

export class TelegramBotService {
    private bot: TelegramBot;

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
    }

    public getBot(): TelegramBot {
        return this.bot;
    }

    public async setWebhook(webhookUrl: string): Promise<void> {
        await this.bot.setWebHook(webhookUrl);
    }
}
