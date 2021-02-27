const http = require('http')

const app = require('./app')
const server = http.Server(app)

const config = require('./config')
const logger = require('./logger')
const io = require('./io')
const laser = require('./vl53l0x')


io.attach(server)

server.listen(config.server.port, () => {
  logger.info(`HTTP server is listening!`)
})

laser()
