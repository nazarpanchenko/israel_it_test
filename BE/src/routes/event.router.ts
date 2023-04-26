import express from 'express';

import { eventValidator } from '../validators';
import { eventController } from '../controllers';
import { validateRoute } from '../middlewares';

const eventRouter = express.Router();

eventRouter.get('/', validateRoute(), eventController.list);

eventRouter.post('/', eventValidator.create, validateRoute(), eventController.create);

eventRouter.put('/', eventValidator.update, validateRoute(), eventController.update);

export default eventRouter;
