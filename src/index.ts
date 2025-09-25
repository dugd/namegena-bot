import { Server } from './server';
import { token, port, webhookUrl } from './config';

new Server(token as string).start(Number(port), webhookUrl);
