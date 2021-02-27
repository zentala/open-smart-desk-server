const io = require('socket.io')()
const observer = require('node-observer')

let lastLaserNumber = 0;

io.on('connection', (socket) => {
  socket.emit('debug', 'comnnected!')

  setInterval(() => {
    socket.emit('debug', '1s intervall message')
  }, 1000)

  observer.subscribe(socket, 'laser', (who, data) => {
    if(lastLaserNumber != data && data.toString().length <= 3) {

      console.log(data)
      socket.emit('laser', data)
      lastLaserNumber = data;
    }

  }
)

})

module.exports = io
