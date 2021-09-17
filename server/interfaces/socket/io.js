
const socketIO = require('socket.io')
// const observer = require('node-observer')

class Socket {
  constructor({ logger,  emitter}) { // emitter
    this.logger = logger
    this.emitter = emitter

    // Initializing events forwarding
    // backend events forwarded to the client
    this.observerEvents = [
      'laser', // current desk height
      'work:start', // recorded beginning of the work
      'work:end', // recorded ending of the work
      'memory:saved', // memory was saved
      'memory:got', // remembered value ({ button, height })
    ]

    // client events forwarded to the backend
    this.socketEvents = [
      'motor', // motor events to relays (up, down, stop)
      'relay',
      'memory:get', // get memorized height (height)
      'memory:go', // go to the memorized height (button)
      'memory:save', // save the current height as memorized height ({button, height})
    ]
  }

  start(http) {
    this.io = socketIO(http)
    this.logger.info(`Attached Socket.IO server under ${this.io.engine.opts.path}`)

    this.io.on('connection', (socket) => {
      this.logger.info('Socket client connected')
      socket.emit('debug', 'socket connected')

      // Setting up events forwarding
      // backend > frontend
      this.observerEvents.forEach((key) => {
        this.emitter.on(key, (payload) => {
          this.logger.debug(`Forwarding to the Socket: ${key}`)
          socket.emit(key, payload)
        })
      })

      // frontend > backend
      this.socketEvents.forEach((key) => {
        socket.on(key, (payload) => {
          this.logger.debug(`Receiving from the Socket: ${key}`)
          this.emitter.emit(key, payload)
        })
      })
    })
  }
}

module.exports = Socket
