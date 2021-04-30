class BaseError extends Error {
  status = 400;

  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = BaseError
