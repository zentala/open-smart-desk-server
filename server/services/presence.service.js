class PresenceService {
  lastDate;
  lastName;
  startedActivity = false;
  // let time
  // let lastSavedTimeID;
  valuesMatcher;



  constructor({ logger, config, eventRepository, emitter }) {
    this.logger = logger
    this.eventRepository = eventRepository
    this.config = config
    this.emitter = emitter
  }

  async feed(value, type) {
    const date = new Date()
    this.lastDate = date

    const name = this.translate(value)
    this.lastName = name

    this.logger.info(`Presence service translates PIR '${type}' value '${value}' to event '${name}'`)

    switch(type) {
      case('initial'):
        await this.saveEvent(name, date)
        break
      case('update'):
        if(this.lastName !== name) await this.probeEvent(name, date)
        break
      case('leaving'):
      await this.saveEvent('unknown', date)
        break
    }
  }


  translate(value) { // pir value to event name
    return this.config.pir.dict[value]
  }

  // process(value, type) {
  //   type = 'absent';
  //   this.saveEvent(type)
  // }

  async saveEvent(eventName, eventDate) {
    if(!eventDate) eventDate = new Date()
    this.logger.info(`Saving event '${eventName}' in the repository`)

    this.eventRepository.saveEvent(eventName, eventDate)
    this.emitter.emit('work', eventName, eventDate)
  }

  async probeEvent(name, date) {
    setTimeout(()=> {
      // if(lastActivity <= date) {
      if(this.lastDate && new Date() - this.lastDate > this.config.pir.timeout) {
        this.logger.info(`Record event '${name} time at: ${date}`)
        this.startedActivity = false
        this.saveEvent(name, date)
      }
    }, this.config.pir.timeout)
  }

}

module.exports = PresenceService
