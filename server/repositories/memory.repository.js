const { MemoryModel } = require('./models/memory.model')
const { inNumberInRange } = require('../helpers')
class MemoryRepository {
  constructor({ config, errors }) {
    this.config = config
    this.errors = errors
  }

  async upsertMemory(button, height) {
    if (!inNumberInRange(button, ...this.config.desk.memoryButtonsRange))
      throw new this.errors.InvalidParameterError(`Button must be between ${this.config.desk.buttonsRange[0]} and ${this.config.desk.buttonsRange[1]}`)

    if (!inNumberInRange(height, ...this.config.desk.heightRange))
      throw new this.errors.InvalidParameterError(`Height must be between ${this.config.desk.heightRange[0]} and ${this.config.desk.heightRange[1]}`)

    await MemoryModel.updateOne({ button }, { height }, { upsert: true })
  }

  // Get memory by button from memory model
  async getMemory(button) {
    return await MemoryModel.findOne({ button })
  }

  // Remove memory by button from memory model
  async removeMemory(button) {
    await MemoryModel.findOne({ button }).remove()
  }

  // Get all memory from memory model
  async getAllMemories() {
    return await MemoryModel.find({})
  }
}

module.exports = MemoryRepository
