const { EventModel } = require('./models/events.model')

class EventRepository {
  constructor({ config, errors }) {
    this.config = config
    this.errors = errors
  }

  async saveEvent(type, date) {
    if(!this.isEventTypeValid(type)) {
      throw new this.errors.InternalServerError(`Unable to save event, event type "${type}" is not valid.`)
    }
    try {
      const newRecord = new EventModel({ type, date });
      try {
        return await newRecord.save()
      } catch (error) {
        return new this.errors.InternalServerError(error.message)
      }
    } catch (error) {
      throw new this.errors.InternalServerError(error.message)
    }
  }

  async getLastPresenceEvent() {
    //
  }

  isEventTypeValid(type) {
    const allowedTypes = ['absent', 'present', 'unknown', 'standing', 'sitting', 'on', 'off']
    return allowedTypes.includes(type)
  }
}

module.exports = EventRepository
