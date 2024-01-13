import { Logger, Config, EventRepository, Emitter } from './your-import-paths'; // Zaimportuj odpowiednie zależności

class PresenceService {
  private lastDate: Date | null;
  private lastName: string | null;
  private startedActivity: boolean = false;
  private valuesMatcher: any; // Możesz określić typ, który pasuje do 'valuesMatcher'

  constructor({ logger, config, eventRepository, emitter }: {
    logger: Logger,
    config: Config,
    eventRepository: EventRepository,
    emitter: Emitter
  }) {
    this.logger = logger;
    this.eventRepository = eventRepository;
    this.config = config;
    this.emitter = emitter;
    this.lastDate = null;
    this.lastName = null;
  }

  async feed(value: any, type: string): Promise<void> {
    const date = new Date();
    this.lastDate = date;

    const name = this.translate(value);
    this.lastName = name;

    this.logger.info(`Presence service translates PIR '${type}' value '${value}' to event '${name}'`);

    switch (type) {
      case 'initial':
        await this.saveEvent(name, date);
        break;
      case 'update':
        if (this.lastName !== name) await this.probeEvent(name, date);
        break;
      case 'leaving':
        await this.saveEvent('unknown', date);
        break;
    }
  }

  private translate(value: any): string { // pir value to event name
    return this.config.pir.dict[value];
  }

  private async saveEvent(eventName: string, eventDate?: Date): Promise<void> {
    if (!eventDate) eventDate = new Date();
    this.logger.info(`Saving event '${eventName}' in the repository`);

    this.eventRepository.saveEvent(eventName, eventDate);
    this.emitter.emit('work', eventName, eventDate);
  }

  private async probeEvent(name: string, date: Date): Promise<void> {
    setTimeout(() => {
      if (this.lastDate && new Date() - this.lastDate > this.config.pir.timeout) {
        this.logger.info(`Record event '${name} time at: ${date}`);
        this.startedActivity = false;
        this.saveEvent(name, date);
      }
    }, this.config.pir.timeout);
  }
}

export default PresenceService;
