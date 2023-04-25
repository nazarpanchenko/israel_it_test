import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getStatusCode } from 'http-status-codes';
import { eventProvider } from '../services';
import { EventsList } from '../shared/types';

const eventController = {
  list: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list: EventsList = await eventProvider.list();
      res.send(list);
    } catch (err: any) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await eventProvider.createEvent(req.body);
      res.status(StatusCodes.CREATED).send({ statusCode: getStatusCode('Created') });
    } catch (err: any) {
      next(err);
    }
  },

  ignore: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventsCount = await eventProvider.ignoreEvent(req.body.id);
      res
        .status(StatusCodes.OK)
        .send({ statusCode: getStatusCode('OK'), data: eventsCount });
    } catch (err: any) {
      next(err);
    }
  },

  report: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventsCount = await eventProvider.reportEvent(req.body.id);
      res
        .status(StatusCodes.OK)
        .send({ statusCode: getStatusCode('OK'), data: eventsCount });
    } catch (err: any) {
      next(err);
    }
  },
};

export default eventController;
