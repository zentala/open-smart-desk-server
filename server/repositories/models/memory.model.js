const { model, Schema } = require('mongoose')

const eventSchema = new Schema(
  {
    button: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  {
    versionKey: false
  }
)

const memoryModel = model('Memory', eventSchema)

module.exports = {
  MemoryModel: memoryModel,
  MemorySchema: eventSchema
}
