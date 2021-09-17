const { MemoryModel } = require('./models/memory.model')
const { inNumberInRange } = require('../helpers')
class MemoryRepository {
  constructor({ config, errors }) {
    this.config = config
    this.errors = errors
    this.errors = {
      InvalidParameterError: class InvalidParameterError extends Error {
        constructor(message) {
          super(message)
          this.name = 'Invalid Parameter Error'
        }
      }
    }
  }

  async upsertMemory(button, height) {
    const buttonsRange = [1,4]
    const heightRange = [0,1500]

    if (!inNumberInRange(button, ...buttonsRange))
      throw new this.errors.InvalidParameterError(`Button must be between ${buttonsRange[0]} and ${buttonsRange[1]}`)

    if (!inNumberInRange(height, ...heightRange))
      throw new this.errors.InvalidParameterError(`Height must be between ${heightRange[0]} and ${heightRange[1]}`)

    await MemoryModel.updateOne({ button }, { height }, { upsert: true })
  }

  // Get memory by button from memory model
  async getMemory(button) {
    const memory = await MemoryModel.findOne({ button })
    return memory
  }

  // Remove memory by button from memory model
  async removeMemory(button) {
    const memory = await MemoryModel.findOne({ button })
    await memory.remove()
  }

  // Get all memory from memory model
  async getAllMemories() {
    const memory = await MemoryModel.find({})
    return memory
  }

}

module.exports = MemoryRepository
