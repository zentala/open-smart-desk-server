import { Logger, Server, Database, IO, PIR, EventRepository, Relay, LDM, MemoryService, HeightService } from './your-import-paths'; // TODO

class Application {
  private server: Server;
  private database: Database;
  private logger: Logger;
  private io: IO;
  private pir: PIR;
  private ldm: LDM;
  private eventRepository: EventRepository;
  private relay: Relay;
  private memoryService: MemoryService;
  private heightService: HeightService;

  constructor({ logger, server, database, io, pir, eventRepository, relay, ldm, memoryService, heightService }: {
    logger: Logger,
    server: Server,
    database: Database,
    io: IO,
    pir: PIR,
    eventRepository: EventRepository,
    relay: Relay,
    ldm: LDM,
    memoryService: MemoryService,
    heightService: HeightService
  }) {
    this.server = server;
    this.database = database;
    this.logger = logger;
    this.io = io;
    this.pir = pir;
    this.ldm = ldm;
    this.eventRepository = eventRepository;
    this.relay = relay;
    this.memoryService = memoryService;
    this.heightService = heightService;
  }

  async start(): Promise<void> {
    this.logger.info(`Started iDesk server as Process ID ${process.pid}`);
    await this.database.connect();
    await this.eventRepository.saveEvent('on');
    await this.io.start(await this.server.start());
    await this.heightService.start();
    await this.pir.start();
    await this.relay.start();
    await this.ldm.start();
    await this.memoryService.start();
  }

  async stop(options: any): Promise<void> {
    await this.eventRepository.saveEvent('off');
    this.logger.info('Stopping app...');
    // await this.database.disconnect();
    // await this.server.stop();
    await this.pir.stop();
  }
}

export default Application;
