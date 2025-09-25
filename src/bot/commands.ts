import type { BotCommand } from '../types/bot';
import { generateName } from '../service/genname';
import { FavoriteService } from '../service/favorite';

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
/gen [first_name] [second_name] - Generate new name based on two names
/favorite - Show favorite names
/help - Show this help message
`;
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
        const result = generateName(name1, name2);
        await ctx.reply(`New name: ${result}`, {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Save', callback_data: `save:${name1}:${name2}:${result}` }],
                ],
            },
        });
    },
};

const favoriteCommand: BotCommand = {
    command: 'favorite',
    description: 'Show favorite names',
    async handler(ctx) {
        if (!ctx.service) {
            await ctx.reply('Service not available.');
            return;
        }
        if (!ctx.from) {
            await ctx.reply('User information not available.');
            return;
        }
        const favorites = await ctx.service.getFavorites(String(ctx.from.id));
        if (favorites.length === 0) {
            await ctx.reply('You have no favorite names.');
            return;
        }
        const favoriteList = FavoriteService.prettyPrintFavorites(favorites);
        await ctx.reply(`Your favorite names:\n${favoriteList}`);
    },
};

export const commands: BotCommand[] = [startCommand, helpCommand, genCommand, favoriteCommand];
