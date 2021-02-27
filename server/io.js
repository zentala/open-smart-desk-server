const io = require('socket.io')()

io.on('connection', (socket) => {
  socket.emit('debug', 'comnnected!')

  setInterval(() => {
    socket.emit('debug', '1s intervall message')
  }, 1000)
})

module.exports = io
