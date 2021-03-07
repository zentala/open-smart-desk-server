const http = require('http')

const app = require('./app')
const server = http.Server(app)

const config = require('./config')
const logger = require('./logger')
const io = require('./io')
const laser = require('./vl53l0x')
const relays = require('./relays')
const pir = require('./pir')
const db = require('./db')

io.attach(server)
db.connect(() => {
  server.listen(config.server.port, () => {
    logger.info(`HTTP server is listening at port ${config.server.port}!`)
  })

  laser()
  relays()
  pir()
})




