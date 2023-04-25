import { param, body } from 'express-validator';
import { EVENT_SEVERITY } from '../consts';

const eventValidator = {
  create: [
    body('name').isString(),
    body('timestamp').isInt().isLength({ min: 1, max: 2 }),
    body('severity').isIn(Object.values(EVENT_SEVERITY)).optional(),
  ],

  ignore: [body('id').isMongoId()],

  report: [body('id').isMongoId()],
};

export default eventValidator;
