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
    pattern: /^\/gen(\s*)(.*)/u,
    description: 'Generate new name based on two names',
    async handler(ctx, match) {
        const args = match?.[2]?.split(/\s+/) || [];
        if (args.length < 2) {
            await ctx.reply('Please provide two names. Usage: /gen [first_name] [second_name]');
            return;
        }
        const [name1 = '', name2 = ''] = args;
        if (!name1.match(/^\p{L}+$/u) || !name2.match(/^\p{L}+$/u)) {
            await ctx.reply('Names must contain only alphabetic characters.');
            return;
        }
        await ctx.reply(`New name: ${generateName(name1, name2)}`);
    },
};

export const commands: BotCommand[] = [startCommand, helpCommand, genCommand];
