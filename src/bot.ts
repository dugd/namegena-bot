import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

import { token, port, webhookUrl } from './config';

const bot = new TelegramBot(token!, { polling: false });

const app = express();
app.use(express.json());

app.post(`/webhook/${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === '/start') {
        await bot.sendMessage(chatId, 'Привіт! Надсилаю тестове відео 📹');
        await bot.sendVideo(chatId, 'https://www.w3schools.com/html/mov_bbb.mp4');
    }
});

app.listen(port, () => {
    bot.setWebHook(`${webhookUrl}/webhook/${token}`)
        .then(() => console.log('Webhook set successfully'))
        .catch(console.error);
    console.log(`Server is running on port ${port}`);
});
