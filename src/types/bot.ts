import { Message } from 'node-telegram-bot-api';
import { FavoriteService } from '../service/favorite';

export interface BotContext {
    message: Message;
    from: Message['from'];
    chat: Message['chat'];
    service?: FavoriteService; // It's better to not do this, but for simplicity...
    reply(text: string, options?: any): Promise<Message>;
}

export interface BotCommand {
    command: string;
    description: string;
    pattern?: RegExp;
    handler(ctx: BotContext, match: RegExpExecArray | null): Promise<void>;
}
