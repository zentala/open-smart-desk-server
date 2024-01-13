import BaseError from './BaseError';

class InternalServerError extends BaseError {
  status: number = 500;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = `Internal Server Error`;
  }
}

export default InternalServerError;
