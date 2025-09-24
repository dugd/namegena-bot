import { Server } from './server';
import { token, port, webhookUrl } from './config';

new Server(token).start(Number(port), webhookUrl);
