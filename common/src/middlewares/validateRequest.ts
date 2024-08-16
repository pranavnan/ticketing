import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/requestValidationError';

function validateRequest(req: Request, res: Response, next: NextFunction) {
  // console.log({ req_body: req.body });
  const errors = validationResult(req);

  // console.log({ validateRequest_12: errors });

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
}

export { validateRequest };
