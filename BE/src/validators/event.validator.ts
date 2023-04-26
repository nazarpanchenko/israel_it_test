import { query, body } from 'express-validator';
import { EVENT_SEVERITY, EVENT_STATE } from '../consts';

const eventValidator = {
  list: [query('action').isIn(Object.values(EVENT_STATE)).optional()],

  create: [
    body('name').isString(),
    body('severity').isIn(Object.values(EVENT_SEVERITY)).optional(),
  ],

  update: [
    body('id').isMongoId(),
    body('action').isIn(Object.values(EVENT_STATE)),
  ],
};

export default eventValidator;
