const mongoose = require('mongoose');

const config = require('./config')
const logger = require('./logger')

const connect = (callback) => {
  logger.verbose(`Attempting to connect with MongoDB at ${config.db.uri}`)
  mongoose
    .connect(config.db.uri, config.db.options)
    .then(() => {
      logger.info(`Connected with MongoDB at ${config.db.uri}`)
      callback()
    })
    .catch((err) => {
      console.log(err)
      logger.info(`Unable to connect MongoDB. Check if deamon is started...`)
      process.exit(1)
    });
}

module.exports = { connect }
