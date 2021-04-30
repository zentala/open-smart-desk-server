const { model, Schema } = require('mongoose')

const eventSchema = new Schema(
  {
    type: { type: String, required: true },
    date: { type: Number, required: true }
  },
  {
    versionKey: false
  }
)

const eventModel = model('Event', eventSchema)

module.exports = {
  EventModel: eventModel,
  EventSchema: eventSchema
}
