const VL53L0X = require('vl53l0x')

class LDM { // Laser Distance Meter
  constructor({ logger, emitter, helpers }) {
    this.logger = logger
    this.emitter = emitter
    this.helpers = helpers

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
    console.log(height)
    this.logger.info(`Initial height measurment: ${height}`)
  }

  async measureAverage(measures = 10) {
    this.logger.info('LDM will try to measure average')
    let results = []
    let lastLaserNumber = 0;
    let lastWrongLaserNumber;
    let doMeasure = true
    let measureCounter = 0
    let errorsAmount = 0

    await VL53L0X(...this.args)
      .then(async (vl53l0x) => {
        await vl53l0x.setMeasurementTimingBudget(200000)
        while(doMeasure) {
          // console.log('4')
          let range = await vl53l0x.measure()

          if(range && range.toString().length <= 3) {

            if(lastLaserNumber !== range) {
              this.logger.debug(`LDM new range measured: ${range}`)
              lastLaserNumber = range
              results.push(range)
              this.emitter.emit('laser', range)

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
            errorsAmount += 1
            if(errorsAmount > 100) {
              this.logger.error(`LDM detected more then 100 reading errors. Quiting...`)
              doMeasure = false
              return false
            }
            if(lastWrongLaserNumber !== range) {
              lastWrongLaserNumber = range
              this.logger.warn(`LDM readed wrong range: ${range}`)
            }
          }


        console.log(5)        }
      })
      .catch((err) => console.error('LDM Error: ' + err))
  }

  measureAverageWorking(measures = 10) {
    this.logger.info('LDM initializing...')
    let results = []
    let lastLaserNumber = 0;
    let lastWrongLaserNumber;
    let doMeasure = true
    let measureCounter = 0
    VL53L0X(...this.args)
    .then(async (vl53l0x) => {
      await vl53l0x.setMeasurementTimingBudget(200000)
      while(doMeasure) {
        // console.log("next")
        let range = await vl53l0x.measure()
        // console.log(lastLaserNumber != range)

        if(range && range.toString().length <= 3) {

          if(lastLaserNumber !== range) {
            this.logger.debug(`LDM new range measured: ${range}`)
            lastLaserNumber = range
            results.push(range)
            this.emitter.emit('laser', range)

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
          if(lastWrongLaserNumber !== range) {
            lastWrongLaserNumber = range
            this.logger.warn(`LDM readed wrong range: ${range}`)
          }
        }

      }
    })
    .catch((err) => console.error('LDM Error: ' + err))
  }



  original() {
    this.logger.info('Initializing laser module')
    let lastLaserNumber = 0;
    let doMeasure = true
    let measureCounter = 0
    VL53L0X(...this.args)
    .then(async (vl53l0x) => {
      await vl53l0x.setMeasurementTimingBudget(200000)
      while(doMeasure) {
        let range = await vl53l0x.measure()
        // console.log(lastLaserNumber != range)

        if(range && lastLaserNumber !== range && range.toString().length <= 3) {
          this.logger.info(`LDM new range measured: ${range}`)
          this.emitter.emit('laser', range)
          lastLaserNumber = range
        } else {
          // console.log(lastLaserNumber !== range)
          // console.log(range.toString().length <= 3)
          // logger.error(`Wrong range: ${range}`)
        }
        measureCounter += 1
        if(measureCounter > 5) doMeasure = false
        // console.log(doMeasure)
        // console.log(measureCounter)

      }
    })
    .catch(console.error)
  }
}

module.exports = LDM
