import 'dotenv/config';

export const token = process.env.TELEGRAM_TOKEN;
export const port = process.env.APP_PORT || 8000;
export const webhookUrl = process.env.WEBHOOK_URL || '';

if (!token) {
    throw new Error('TELEGRAM_TOKEN is required');
}

export default { token, port, webhookUrl };
