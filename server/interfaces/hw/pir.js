const GPIO = require('onoff').Gpio

class PIR { // Passive infrared sensor
  constructor ({ config, logger, presenceService }) {
    this.logger = logger
    this.config = config
    this.presenceService = presenceService
  }

  start() {
    this.sensor = new GPIO(this.config.pir.pin, 'in', 'both')
    this.logger.info(`PIR sensor set up on RPi PIN ${this.config.pir.pin}`)
    this.sensor.read(async(err, value) => await this.emit(err, value, 'initial'))
    this.sensor.watch(async(err, value) => await this.emit(err, value, 'update'))
  }

  async stop() {
    if(this.sensor) {
      this.sensor.read((err, value) => {
        this.emit(err, value, 'leaving')
      })
      this.logger.info(`PIR succesfully unexported before exit`)
      this.sensor.unexport()
    } else {
      this.logger.warn("Tried to unexport PIR but it seeems not to be initialized")
      await this.emit(true, undefined, 'leaving')
    }
  }

  async emit(err, status, type) {
    if(err) {
      this.logger.error(`PIR sensor returned error for reading type '${type} with status '${status}'`)
      this.logger.error(err)
      await this.presenceService.feed(undefined, type)
    }
    else {
      this.logger.info(`PIR is emiting status type '${type}' with value '${status}'`)
      await this.presenceService.feed(status, type)
    }
  }
}

module.exports = PIR
