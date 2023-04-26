import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { eventProvider } from '../services';
import { EventsList } from '../shared';

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
      res.status(StatusCodes.CREATED).send({ message: 'Event stored' });
    } catch (err: any) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventsCount = await eventProvider.setEventStatus(req.body.id, req.body?.action);
      res.status(StatusCodes.OK).send({ eventsCount });
    } catch (err: any) {
      next(err);
    }
  },
};

export default eventController;
