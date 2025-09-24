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

app.listen(port, () => {
    if (process.env.NODE_ENV === 'production') {
        bot.setWebHook(`${webhookUrl}/webhook/${token}`)
            .then(() => console.log('Webhook set successfully'))
            .catch(console.error);
    }
    console.log(`Server is running on port ${port}`);
});
