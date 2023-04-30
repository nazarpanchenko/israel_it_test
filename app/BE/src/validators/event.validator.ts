import { query, body } from 'express-validator';
import { FETCH_LIMIT, EVENT_SEVERITY } from '../consts';

const eventValidator = {
  list: [query('limit').isIn(Object.values(FETCH_LIMIT)).optional()],

  create: [
    body('name').isString(),
    body('severity').isIn(Object.values(EVENT_SEVERITY)).optional(),
  ],

  ignore: [body('id').isMongoId()],

  report: [body('id').isMongoId()],
};

export default eventValidator;
