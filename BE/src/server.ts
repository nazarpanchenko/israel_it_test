import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import morgan from 'morgan';

import { handleErrors } from './middlewares';
import * as routers from './routes';
import initDB from './db/conf';
import { eventProvider } from './services';
import { logger } from './utils';
import { API_PREFIX, EVENT_STATE } from './consts';
import { EventsCount, WebSocketMessage } from './shared';

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
  const PORT = process.env.PORT || 9000;
  const WS_PORT = process.env.WS_PORT || 8000;

  try {
    const server = http.createServer();
    const wss = new WebSocketServer({ server });

    server.listen(WS_PORT, () => {
      logger.info(`WebSocket server is running on port ${WS_PORT}`);
    });

    wss.on('connection', ws => {
      logger.info('Web socket connected to client');

      ws.on('message', async (message: string) => {
        logger.info(`Client message received. Message: ${message}`);

        const _message: WebSocketMessage = JSON.parse(message);
        const stateFieldName = EVENT_STATE.IGNORED as string;
        const eventState = _message.body[stateFieldName as keyof typeof _message.body]
          ? EVENT_STATE.IGNORED
          : EVENT_STATE.REPORTED;

        const eventsCount: EventsCount = await eventProvider.setEventStatus(
          _message.sender,
          eventState
        );
        ws.send(JSON.stringify(eventsCount));
      });

      ws.on('close', () => logger.info('Web socket disconnected from client'));
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
