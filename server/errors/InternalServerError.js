const BaseError = require('./BaseError')

class InternalServerError extends BaseError {
  status = 500;

  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = `Internal Server Error`
  }
}

module.exports = InternalServerError
