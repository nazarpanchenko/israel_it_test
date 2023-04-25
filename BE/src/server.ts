import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { handleErrors } from './middlewares';
import * as routers from './routes';
import initDB from './db/conf';
import { logger } from './utils';
import { API_PREFIX } from './consts';

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

  try {
    app.listen(PORT, async (): Promise<void> => {
      logger.info(`Server is listening on the port ${PORT}`);
      await initDB();
      logger.info(`Database has been successfully initialized`);
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

export default startServer;
