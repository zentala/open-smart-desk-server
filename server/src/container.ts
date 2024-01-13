import { createContainer, asClass, asFunction, asValue } from 'awilix';

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
    emitter: asValue(require('./emitter')),
    helpers: asValue(require('./helpers'))
  })
  .register({ // repositories
    eventRepository: asClass(require('./repositories/event.repository')),
    memoryRepository: asClass(require('./repositories/memory.repository')),
  })
  .register({ // services
    presenceService: asClass(require('./services/presence.service')),
    memoryService: asClass(require('./services/memory.service')),
    heightService: asClass(require('./services/height.service'))
  })
  .register({ // hardware interfaces
    pir: asClass(require('./interfaces/hw/pir')),
    ldm: asClass(require('./interfaces/hw/ldm')),
    relay: asClass(require('./interfaces/hw/relay')),
  });

export default container;
