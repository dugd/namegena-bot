import { Message } from 'node-telegram-bot-api';

export interface BotContext {
    message: Message;
    from: Message['from'];
    chat: Message['chat'];
    reply(text: string, options?: any): Promise<Message>;
}

export interface BotCommand {
    command: string;
    description: string;
    pattern?: RegExp;
    handler(ctx: BotContext, match: RegExpExecArray | null): Promise<void>;
}
