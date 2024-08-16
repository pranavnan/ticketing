import { ValidationError } from "express-validator";
import { CustomError } from "./customError";

class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending the build in class
    Object.setPrototypeOf(this, RequestValidationError.prototype); // this is Just some behind-the-scenes stuff, that's get our class to work correctly, because we are extending a build in class
  }

  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      // @ts-ignore
      field: error.path,
    }));
  }
}

export { RequestValidationError };
