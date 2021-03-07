const observer = require('node-observer')
const GPIO = require('onoff').Gpio

const config = require('./config')
const logger = require('./logger')
const { Time } = require('./models')

module.exports = () => {
  logger.info('Starting work time tracking')

  let lastActivity;
  let startedActivity = false;
  let time
  let lastSavedTimeID;

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

          time = new Time({ start: currentTime })
          time
            .save()
            .then((document) => {
              // console.log(document._id)
              lastSavedTimeID = document._id
            })
            .catch(err => console.log(err))

        }
    } else {
      if(config.pir.debug) logger.debug(`PIR sensor: movement ended`)
      lastActivity = new Date()

      setTimeout(()=> {
        if(lastActivity && new Date() - lastActivity > config.pir.timeout) {
          logger.info(`Record end of working time at: ${lastActivity}`)
          startedActivity = false
          observer.send(this, 'work:end', lastActivity)
          time.end = lastActivity
          console.log(time.start)
          time
            .save()
            .then((document) => {
              // console.log(document._id)
              lastSavedTimeID = document._id
              time = new Time({})
            })
            .catch(err => console.log(err))


        }
      }, config.pir.timeout)
    }
  });

}
