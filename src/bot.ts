import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config();
}

const { token, port } = await import('./config.js');

const bot = new TelegramBot(token!, { polling: false });

const app = express();
app.use(express.json());

app.post(`/webhook/${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
