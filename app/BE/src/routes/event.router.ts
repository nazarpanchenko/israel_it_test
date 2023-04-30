import express from 'express';

import { eventValidator } from '../validators';
import { eventController } from '../controllers';
import { validateRoute } from '../middlewares';

const eventRouter = express.Router();

eventRouter.get('/', validateRoute(), eventController.list);

eventRouter.post('/ignore', eventValidator.ignore, validateRoute(), eventController.ignore);

eventRouter.post('/report', eventValidator.report, validateRoute(), eventController.report);

export default eventRouter;
