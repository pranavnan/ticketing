import { CustomError } from "./customError";

class DatabaseConnectionError extends CustomError {
  reason = "Error connection to database";
  statusCode = 500;

  constructor() {
    super('Error connecting to database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}

export { DatabaseConnectionError };
