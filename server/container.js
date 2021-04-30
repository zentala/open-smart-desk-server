const { createContainer, asClass, asFunction, asValue } = require('awilix');

const container = createContainer();

container
  .register({ // configuration
    config: asValue(require('./config')),
    errors: asValue(require('./errors'))
  })
  .register({ // application
    app: asClass(require('./app')),
    logger: asValue(require('./logger')),
    server: asClass(require('./interfaces/http/Server')),
    io: asClass(require('./interfaces/socket/io')),
    database: asClass(require('./interfaces/db')),
    emitter: asValue(require('./emitter'))
  })
  .register({ // repositories
    eventRepository: asClass(require('./repositories/event.repository')),
  })
  .register({ // services
    presenceService: asClass(require('./services/presence.service')),
  })
  .register({ // hardware interfaces
    pir: asClass(require('./interfaces/hw/pir')),
    ldm: asClass(require('./interfaces/hw/ldm')),
    relay: asClass(require('./interfaces/hw/relay')),
  })

module.exports = container
