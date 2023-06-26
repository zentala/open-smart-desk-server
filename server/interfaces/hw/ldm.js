const VL53L0X = require('vl53l0x')

class LDM { // Laser Distance Meter
  constructor({ config, emitter, helpers, logger }) {
    this.config = config
    this.emitter = emitter
    this.helpers = helpers
    this.logger = logger

    // Optionally, try developing with an i2cdriver!
    // this.args = ['/dev/tty.usbserial-DO01INSW', 0x29, 'i2cdriver/i2c-bus']
    this.args = [1, 0x29]
  }

  async start() {
    this.logger.info('LDM initializing...')
    await this.initialCheck();
  }

  async initialCheck() {
    const height = await this.measureAverage()
    this.logger.info(`Initial height measurment: ${height}`)
  }

  async measureAverage(measures = 10) {
    this.logger.info('LDM will try to measure average')
    let results = []
    let previousMeasuredNumber = 0;
    let lastWrongLaserNumber;
    let doMeasure = true
    let measureCounter = 0
    let errorsAmount = 0

    return await VL53L0X(...this.args)
      .then(async (vl53l0x) => {
        await vl53l0x.setMeasurementTimingBudget(200000)
        while(doMeasure) {
          // console.log('4')
          let measuredHeight = await vl53l0x.measure()

          if(measuredHeight && this.helpers.inNumberInRange(measuredHeight, ...this.config.desk.heightRange)) {

            // we are looking for few readings to get average
            if(previousMeasuredNumber !== measuredHeight) {
              this.logger.debug(`LDM new range measured: ${measuredHeight}`)
              results.push(measuredHeight)
              previousMeasuredNumber = measuredHeight
              this.emitter.emit('laser', measuredHeight)

              // if we have enough diffrent readings, we can stop
              measureCounter += 1
              if(measureCounter >=measures) {
                doMeasure = false
                const average = this.helpers.roundedAverage(results)
                this.emitter.emit('laser', average)
                this.logger.info(`LDM average ${average}mm from ${measures} readings: ${results.join('mm, ').toString()}mm`)
                return average
              }
            }

          } else {
            // counting errors so we can stop process if needed
            errorsAmount += 1
            if(errorsAmount > 100) {
              this.logger.error(`LDM detected more then 100 reading errors. Quiting...`)
              doMeasure = false
              return false
            }
            if(lastWrongLaserNumber !== measuredHeight) {
              lastWrongLaserNumber = measuredHeight
              this.logger.warn(`LDM readed wrong range: ${measuredHeight}`)
            }
          }
        }
      })
      .catch((err) => console.error('LDM Error: ' + err))
  }

  }

module.exports = LDM
