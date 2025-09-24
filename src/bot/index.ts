import TelegramBot from 'node-telegram-bot-api';

export class TelegramBotService {
    private bot: TelegramBot;

    constructor(token: string) {
        this.bot = new TelegramBot(token, { polling: false });
    }

    public getBot(): TelegramBot {
        return this.bot;
    }

    public async setWebhook(webhookUrl: string): Promise<void> {
        await this.bot.setWebHook(webhookUrl);
    }
}
