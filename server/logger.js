const winston = require('winston')
// const config = require('./config')

const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
    //   level: config.logging.level,
      levels: winston.config.npm.levels,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

module.exports = logger
