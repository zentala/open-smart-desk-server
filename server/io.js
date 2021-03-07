const io = require('socket.io')()
const observer = require('node-observer')
const logger = require('./logger')

io.on('connection', (socket) => {
  logger.debug('Socket client connected')
  socket.emit('debug', 'comnnected!')

  // setInterval(() => {
  //   socket.emit('debug', '1s intervall message')
  // }, 1000)

  // receive from observer and emit to the client socket
  const forwardObserver = (key) => observer.subscribe(socket, key, (who, data) => socket.emit(key, data))
  forwardObserver('laser') // current desk height
  forwardObserver('work:start') // recorded beginning of the work
  forwardObserver('work:end') // recorded ending of the work

  // receiving from the client socket and forward to observer
  const forwardSocket = (key) => socket.on(key, (payload) => observer.send(this, key, payload))
  forwardSocket('motor') // motor events to relays (up, down, stop)
  forwardSocket('relay')
})

module.exports = io
