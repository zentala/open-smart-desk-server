const io = require('socket.io')()
const observer = require('node-observer')

io.on('connection', (socket) => {
  socket.emit('debug', 'comnnected!')

  setInterval(() => {
    socket.emit('debug', '1s intervall message')
  }, 1000)

  observer.subscribe(socket, 'laser', (who, data) => socket.emit('laser', data)) // emit desk height to the client
  socket.on("motor", (payload) => observer.send(this, 'motor', payload)) // pass motor events (up, down, stop) to relays

})

module.exports = io
