import { Gpio } from 'onoff';

class Relay {
  private relays: Gpio[] = [];

  constructor({ config, logger, emitter }: { config: any, logger: any, emitter: any }) {
    this.config = config;
    this.logger = logger;
    this.emitter = emitter;
  }

  start() {
    this.initializeRelays();
    this.emitter.on('motor', this.moveMotor.bind(this));
    this.emitter.on('relay', this.testRelay.bind(this));
  }

  initializeRelays() {
    this.config.relay.pins.forEach((pin: number, index: number) => {
      this.logger.info(`Initializing relay no. "${index + 1}" on "GPIO${pin}"`);
      try {
        this.relays[index] = new Gpio(pin, 'out');
        this.relays[index].writeSync(1); // initialize disabled
        this.logger.info(`Relay no. "${index + 1}" on "GPIO${pin}" initialized`);
      } catch (e) {
        this.logger.error(e.message);
        console.log(e);
      }
    });
  }

  moveMotor(direction: string) {
    this.logger.info(direction == 'stop'
      ? `Stopping desk `
      : `Moving desk ${direction}`);

    const states = this.config.relay.directions[direction];
    states.forEach((state: number, index: number) => {
      this.logger.info(`Setting relay no.${index} to ${state}`);
      this.relays[index].writeSync(state);
    });
  }

  testRelay(opts: { number: number, state: number }) {
    this.logger.info(`Setting relay no.${opts.number} to ${opts.state}`);
    this.relays[opts.number].writeSync(opts.state);
  }
}

export default Relay;
