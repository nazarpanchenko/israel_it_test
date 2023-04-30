import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { logger } from '../utils';

const validateRoute =
  () =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const _errors = errors.array().map((err: any) => ({ [err.path]: err.msg }));
      logger.error(`Route validation error. Errors: ${JSON.stringify(_errors)}`);

      return res.status(422).send({ errors: _errors });
    }
    next();
  };

export default validateRoute;
