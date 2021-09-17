const BaseError = require('./BaseError')

class InvalidParameterError extends BaseError {
  status = 400

  constructor(message, status) {
    super(message)
    this.status = status
    this.name = `Invalid Parameter Error`
  }
}

module.exports = InvalidParameterError
