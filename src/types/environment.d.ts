declare namespace NodeJS {
    interface ProcessEnv {
        TELEGRAM_TOKEN: string;
        WEBHOOK_URL?: string;
        PORT?: string;
        NODE_ENV: 'development' | 'production';
        APP_ENV: 'development' | 'production';
    }
}
