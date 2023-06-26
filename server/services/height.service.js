// Reponsible for keeping track (caching) of the current height of the desk

class HeightService {
  constructor({ emitter, logger }) {
    this.height = null;
    this.emitter = emitter
    this.logger = logger
  }

  async start() {
    // this.emitter.on('laser', this.setHeight.bind(this))
    // this.emitter.on('height:get', this.getHeight.bind(this))
    this.emitter.on('laser', (height) => {
      this.logger.info(`HeightService: Saving new height in cache: ${height}`)
      // this.height = height;
      this.setHeight(height)
      console.log(this.height)
    })
    this.emitter.on('height:get', () => {
      console.log(this.height)
      this.logger.info(`HeightService: Sending cached height to the client: ${this.height}`)
      this.emitter.emit('height:got', this.height)
      return this.height
    })
  }

  getHeight() {
    console.log(this.height)
    return this.height
  }

  setHeight(height) {
    console.log(this.height)
    this.height = height;
    console.log(this.height)
  }
}

module.exports = HeightService
