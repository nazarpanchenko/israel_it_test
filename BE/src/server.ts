import express from 'express';
import { WebSocketServer } from 'ws';
import { Socket } from 'dgram';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';

import { handleErrors } from './middlewares';
import * as routers from './routes';
import initDB from './db/conf';
import { logger } from './utils';
import { API_PREFIX, EVENT_STATE } from './consts';
import { eventProvider } from './services';
import { IgnoredEventsCount, ReportedEventsCount } from './shared';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'));

app.use(`${API_PREFIX}/events`, routers.eventRouter);

app.use(handleErrors);

process.on('uncaughtException', err => {
  logger.error(`uncaughtException: ${err}'`);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logger.error(`unhandledRejection: ${err}'`);
  process.exit(1);
});

const startServer = (): void => {
  const WS_PORT = process.env.WS_PORT || 8000;
  const PORT = process.env.PORT || 9000;

  try {
    const server = http.createServer();
    server.listen(WS_PORT, async (): Promise<void> => {
      logger.info(`WebSocket server is running on port ${WS_PORT}`);
    });

    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: Socket) => {
      logger.info('Web socket connection opened');

      ws.on('message', async (message: string) => {
        logger.info(`Client message received. Message: ${message}`);

        const _message = JSON.parse(message);
        const action = _message.body === EVENT_STATE.IGNORED
          ? EVENT_STATE.IGNORED
          : EVENT_STATE.REPORTED;

        const eventsCount: IgnoredEventsCount | ReportedEventsCount =
          await eventProvider.countEvents(action);
        ws.send(JSON.stringify(eventsCount));
      });

      ws.on('close', () => {
        logger.info('Web socket server closed');
      });
    });

    app.listen(PORT, async (): Promise<void> => {
      logger.info(`Server is listening on port ${PORT}`);
      await initDB();
      logger.info(`Database has been successfully initialized`);
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export default startServer;
