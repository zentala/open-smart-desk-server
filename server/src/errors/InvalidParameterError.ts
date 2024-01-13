import BaseError from './BaseError';

class InvalidParameterError extends BaseError {
  status: number = 400;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.name = `Invalid Parameter Error`;
  }
}

export default InvalidParameterError;
