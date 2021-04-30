const EventEmitter = require('events')

class Emmiter extends EventEmitter {
  constructor() {
    super()
  }
}

module.exports = new Emmiter()
