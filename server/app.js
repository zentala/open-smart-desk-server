class Application {
  constructor({ logger, server, database, io, pir, eventRepository, relay, ldm }) {
    this.server = server
    this.database = database
    this.logger = logger
    this.io = io
    this.pir = pir
    this.ldm = ldm
    this.eventRepository = eventRepository
    this.relay = relay
  }

  async start() {
    this.logger.info(`Started iDesk server as Process ID ${process.pid}`)
    await this.database.connect()
    await this.eventRepository.saveEvent('on')
    await this.io.start(await this.server.start())
    await this.pir.start()
    await this.relay.start()
    await this.ldm.start()
  }

  async stop(options) {
    await this.eventRepository.saveEvent('off')
    this.logger.info('Stopping app...')
    // await this.database.disconnect()
    // await this.server.stop()
    await this.pir.stop()

  }
}

module.exports = Application
