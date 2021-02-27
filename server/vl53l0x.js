const VL53L0X = require('vl53l0x')
const observer = require('node-observer')

const args = [1, 0x29]
// Optionally, try developing with an i2cdriver!
// const args = ['/dev/tty.usbserial-DO01INSW', 0x29, 'i2cdriver/i2c-bus']

module.exports = () => {
  VL53L0X(...args).then(async (vl53l0x) => {
    await vl53l0x.setMeasurementTimingBudget(200000)
    while(true) {
      const range = await vl53l0x.measure()
      // console.log(range)
      observer.send(this, 'laser', range);
    }
  })
  .catch(console.error)
}
