import type { BotCommand } from '../types/bot';
import { generateName } from '../service/genname';

const startCommand: BotCommand = {
    command: 'start',
    description: 'Start the bot',
    async handler(ctx) {
        await ctx.reply('Hello! Send me /gen [first_name] [second_name] command!');
    },
};

const helpCommand: BotCommand = {
    command: 'help',
    description: 'Show help information',
    async handler(ctx) {
        const helpText = `Available commands:
/start - Start the bot
/gen [first_name] [second_name] - Generate new name based on two names`;
        await ctx.reply(helpText);
    },
};

const genCommand: BotCommand = {
    command: 'gen',
    pattern: /^\/gen\s+.*/,
    description: 'Generate new name based on two names',
    async handler(ctx) {
        const match = ctx.message.text?.match(/^\/gen\s+(\p{L}+)\s+(\p{L}+)\s*$/gu);
        match?.shift();
        const name1 = match?.[0] ?? '';
        const name2 = match?.[1] ?? '';
        if (!name1 || !name2) {
            await ctx.reply(
                'Please provide two valid names. Usage: /gen [first_name] [second_name]',
            );
            return;
        }
        await ctx.reply(`New name: ${generateName(name1, name2)}`);
    },
};

export const commands: BotCommand[] = [startCommand, helpCommand, genCommand];
