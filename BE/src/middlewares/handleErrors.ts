import { Request, Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';

import { logger, ApiError } from '../utils';

const handleErrors =
  (err: any) =>
  async (req: Request, res: Response): Promise<void> => {
    logger.error(err.message);
    if (err instanceof ApiError) {
      res.status(err.status).send({
        errCode: err.status,
        errMsg: err.message,
      });
    }
    res.status(err.status).send({ message: getReasonPhrase(err.status) });
  };

export default handleErrors;
