class MemoryService {
  constructor({ logger, config, memoryRepository, emitter, ldm }) {
    this.logger = logger
    this.memoryRepository = memoryRepository
    this.config = config
    this.emitter = emitter
    this.ldm = ldm
  }

  start() {
    this.emitter.on('memory:get', this.getMemory.bind(this))
    this.emitter.on('memory:go', this.goMemory.bind(this))
    this.emitter.on('memory:save', this.saveMemory.bind(this))
  }

  async getMemory(button) {
    this.logger.info(`Getting remembered height for ${button}`)
    let memory = await this.memoryRepository.getMemory(button)
    const height = memory ? memory.height : undefined
    this.logger.info(`Got remembered height for ${button}: ${height}`)
    this.emitter.emit('memory:got', { button, height })
  }

  async saveMemory(button) {
    this.logger.info(`Saving height for ${button}`)
    let height = await this.ldm.measureAverage()
    console.log(height);
    console.log('now I should save height')
    // this.emitter.emit('laser', height)
    // // const height = 10;
    // this.logger.info(`Saving height ${height}mm for button no.${button}`)
    // await this.memoryRepository.upsertMemory(button, height)
    // this.emitter.emit('memory:saved', { button, height })
  }

  async goMemory(button) {
    // Get the memory
    let memory = await this.memoryRepository.getMemory(button)
    if (!memory) {
      return
    }
    this.logger.info(`Going to height ${memory.height} for ${button}`)
  }
}

module.exports = MemoryService;
