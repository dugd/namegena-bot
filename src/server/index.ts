import express from 'express';
import { TelegramBotService } from '../bot';

export class Server {
    private app = express.application;
    private botService: TelegramBotService;

    constructor(botToken: string) {
        this.app = express();
        this.botService = new TelegramBotService(botToken);
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
    }

    private setupRoutes() {
        const bot = this.botService.getBot();

        this.app.post(`/webhook/${process.env.TELEGRAM_TOKEN}`, (req, res) => {
            bot.processUpdate(req.body);
            res.sendStatus(200);
        });

        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });
    }

    public start(port: number, webhookUrl: string) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);

            this.botService
                .setWebhook(`${webhookUrl}/webhook/${process.env.TELEGRAM_TOKEN}`)
                .then(() => console.log('Webhook set successfully'))
                .catch(console.error);
        });
    }
}
