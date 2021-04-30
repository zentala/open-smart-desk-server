
const socketIO = require('socket.io')
// const observer = require('node-observer')

class Socket {
  constructor({ logger,  emitter}) { // emitter
    this.logger = logger
    this.emitter = emitter
  }

  start(http) {
    this.io = socketIO(http)
    this.logger.info(`Attached Socket.IO server under ${this.io.engine.opts.path}`)

    this.io.on('connection', (socket) => {
      this.logger.info('Socket client connected')
      socket.emit('debug', 'comnnected!')

      // setInterval(() => {
      //   socket.emit('debug', '1s intervall message')
      // }, 1000)

      // receive from observer and emit to the client socket
      const forwardObserver = (key) => {
        this.emitter.on(key, payload => {
          this.logger.info(`sendong to socket: ${key}`)
          socket.emit(key, payload)
        })
      }
      forwardObserver('laser') // current desk height
      forwardObserver('work:start') // recorded beginning of the work
      forwardObserver('work:end') // recorded ending of the work

      // // receiving from the client socket and forward to observer
      const forwardSocket = (key) => {
        socket.on(key, payload => {
          this.logger.info(`recived from socket: ${key}`)
          console.log(payload)
          this.emitter.emit(key, payload)
        })
      }
      forwardSocket('motor') // motor events to relays (up, down, stop)
      forwardSocket('relay')
    })
  }

}





module.exports = Socket
