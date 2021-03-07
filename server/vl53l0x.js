const VL53L0X = require('vl53l0x')
const observer = require('node-observer')

const logger = require('./logger')

const args = [1, 0x29]
// Optionally, try developing with an i2cdriver!
// const args = ['/dev/tty.usbserial-DO01INSW', 0x29, 'i2cdriver/i2c-bus']

module.exports = () => {
  logger.info('Initializing laser module')
  let lastLaserNumber = 0;

  VL53L0X(...args).then(async (vl53l0x) => {
    await vl53l0x.setMeasurementTimingBudget(200000)
    while(true) {
      let range = await vl53l0x.measure()
      // console.log(lastLaserNumber != range)

      if(range && lastLaserNumber !== range && range.toString().length <= 3) {
        logger.debug(`New range measured: ${range}`)
        observer.send(this, 'laser', range);
        lastLaserNumber = range;
      } else {
        // console.log(lastLaserNumber !== range)
        // console.log(range.toString().length <= 3)
        // logger.error(`Wrong range: ${range}`)
      }
    }
  })
  .catch(console.error)
}


