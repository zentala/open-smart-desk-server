const GPIO = require('onoff').Gpio

class Relay {
  relays = []

  constructor({ config, logger, emitter }) {
    this.config = config
    this.logger = logger
    this.emitter = emitter
  }

  start() {
    this.initializeRelays()
    this.emitter.on('motor', this.moveMotor.bind(this))
    this.emitter.on('relay', this.testRelay.bind(this))
  }

  initializeRelays() {
    this.config.relay.pins.forEach((pin, index) => {
      this.logger.info(`Initializing relay no. "${index+1}" on "GPIO${pin}"`)
      try {
        this.relays[index] = new GPIO(pin, 'out')
        this.relays[index].writeSync(1) // initialize disabled
        this.logger.info(`Relay no. "${index+1}" on "GPIO${pin}" initialized`)
      } catch(e) {
        this.logger.error(e.message)
        console.log(e)
      }
    })
  }

  moveMotor(direction) {
    this.logger.info(direction == 'stop'
      ? `Stoping desk `
      : `Moving desk ${direction}`)

    const states = this.config.relay.directions[direction]
    states.forEach((state, index) => {
      this.logger.info(`Setting relay no.${index} to ${state}`)
      this.relays[index].writeSync(state)
    })
  }

  testRelay(opts) {
    this.logger.info(`Setting relay no.${opts.number} to ${opts.state}`)
    this.relays[opts.number].writeSync(opts.state)
  }
}

module.exports = Relay
