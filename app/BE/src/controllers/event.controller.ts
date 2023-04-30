import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { eventProvider } from '../services';
import { FetchLimit, EventsList } from '../shared';
import { FETCH_LIMIT } from '../consts';

const eventController = {
  list: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list: EventsList = await eventProvider.list(
        (req.query?.limit || FETCH_LIMIT.AVERAGE) as FetchLimit
      );
      res.send(list);
    } catch (err: any) {
      next(err);
    }
  },

  ignore: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await eventProvider.ignoreEvent(req.body.id);
      res.status(StatusCodes.OK).send({ status: 'Event set ignored' });
    } catch (err: any) {
      next(err);
    }
  },

  report: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await eventProvider.reportEvent(req.body.id);
      res.status(StatusCodes.OK).send({ status: 'Event set reported' });
    } catch (err: any) {
      next(err);
    }
  },
};

export default eventController;
