// Responsible for memorising definied desk heights (so user can go to remembered height)

class MemoryService {
  constructor({ logger, config, memoryRepository, emitter, heightService }) {
    this.logger = logger
    this.memoryRepository = memoryRepository
    this.config = config
    this.emitter = emitter
    this.heightService = heightService
  }

  start() {
    this.emitter.on('memory:get', this.getMemory.bind(this))
    this.emitter.on('memory:go', this.goMemory.bind(this))
    this.emitter.on('memory:save', this.saveMemory.bind(this))
  }

  async getMemory(button) {
    this.logger.info(`MemorySerice: requested for remembered height for button no.${button}`)
    let memory = await this.memoryRepository.getMemory(button)
    const height = memory ? memory.height : undefined
    this.logger.info(`MemorySerice: sharing remembered height for button no.${button}: ${height}`)
    this.emitter.emit('memory:got', { button, height })
  }

  async saveMemory(button) {
    let height = this.heightService.getHeight()

    if(!height) {
      this.logger.error(`MemorySerice: could not get cached height, not saving memory for button no.${button}`)
      return
    }

    this.logger.info(`MemorySerice: saving current desk height (${height}mm) for memory button no.${button}`)
    await this.memoryRepository.upsertMemory(button, height)
    this.emitter.emit('memory:saved', { button, height })
  }

  async goMemory(button) {
    // Get the memory
    let memory = await this.memoryRepository.getMemory(button)
    if (!memory || !memory.height) {
      this.logger.error(`MemorySerice: could not get memorized height for button no.${button}`)
      return
    }
    this.logger.info(`MemorySerice: going to height ${memory.height}mm saved under button no.${button}`)
  }
}

module.exports = MemoryService;
