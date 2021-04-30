const VL53L0X = require('vl53l0x')

class LDM { // Laser Distance Meter
  constructor({ logger, emitter }) {
    this.logger = logger
    this.emitter = emitter

    // Optionally, try developing with an i2cdriver!
    // this.args = ['/dev/tty.usbserial-DO01INSW', 0x29, 'i2cdriver/i2c-bus']
    this.args = [1, 0x29]
  }

  start() {
    this.logger.info('Initializing laser module')
    let lastLaserNumber = 0;

    VL53L0X(...this.args)
    .then(async (vl53l0x) => {
      await vl53l0x.setMeasurementTimingBudget(200000)
      while(true) {
        let range = await vl53l0x.measure()
        // console.log(lastLaserNumber != range)

        if(range && lastLaserNumber !== range && range.toString().length <= 3) {
          this.logger.info(`New range measured: ${range}`)
          this.emitter.emit('laser', range)
          lastLaserNumber = range
        } else {
          // console.log(lastLaserNumber !== range)
          // console.log(range.toString().length <= 3)
          // logger.error(`Wrong range: ${range}`)
        }
      }
    })
    .catch(console.error)
  }
}

module.exports = LDM
