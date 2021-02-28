const observer = require('node-observer')
const GPIO = require('onoff').Gpio

const config = require('./config')
const logger = require('./logger')

module.exports = () => {
  logger.info('Starting work time tracking')

  let lastActivity;
  let startedActivity = false;
  const pir = new GPIO(config.pir.pin, 'in', 'both');
  pir.watch(function(err, value) {
    // TODO handle error

    if (value == 1) {
        if(config.pir.debug) logger.debug('PIR sensor: movement detected')

        const currentTime = new Date()
        lastActivity = currentTime

        if(!startedActivity) {
          logger.info(`Record beginning of working time at ${currentTime}`)
          observer.send(this, 'work:start', currentTime)
          startedActivity = true
        }
    } else {
      if(config.pir.debug) logger.debug(`PIR sensor: movement ended`)
      lastActivity = new Date()

      setTimeout(()=> {
        if(lastActivity && new Date() - lastActivity > config.pir.timeout) {
          if(config.pir.debug) logger.info(`Record end of working time at: ${lastActivity}`)
          startedActivity = false
          observer.send(this, 'work:end', lastActivity)
        }
      }, config.pir.timeout)
    }
  });

}
