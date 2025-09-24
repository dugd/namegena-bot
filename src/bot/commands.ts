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
    description: 'Generate new name based on two names',
    pattern: /^\/gen\s+(\p{L}+)\s+(\p{L}+)\s*$/gu,
    async handler(ctx, match) {
        const name1 = match?.[1] ?? '';
        const name2 = match?.[2] ?? '';
        await ctx.reply(`New name: ${generateName(name1, name2)}`);
    },
};

export const commands: BotCommand[] = [startCommand, helpCommand, genCommand];
