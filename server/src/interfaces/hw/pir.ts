const { Gpio } = require('onoff');

class PIR { // Passive infrared sensor
  private logger: any; // Wstaw odpowiedni typ dla logger
  private config: any; // Wstaw odpowiedni typ dla config
  private presenceService: any; // Wstaw odpowiedni typ dla presenceService
  private sensor: any;

  constructor({ config, logger, presenceService }: { config: any, logger: any, presenceService: any }) {
    this.logger = logger;
    this.config = config;
    this.presenceService = presenceService;
  }

  start() {
    this.sensor = new Gpio(this.config.pir.pin, 'in', 'both');
    this.logger.info(`PIR sensor set up on RPi PIN ${this.config.pir.pin}`);
    this.sensor.read(async (err: Error, value: number) => await this.emit(err, value, 'initial'));
    this.sensor.watch(async (err: Error, value: number) => await this.emit(err, value, 'update'));
  }

  async stop() {
    if (this.sensor) {
      this.sensor.read((err: Error, value: number) => {
        this.emit(err, value, 'leaving');
      });
      this.logger.info(`PIR successfully unexported before exit`);
      this.sensor.unexport();
    } else {
      this.logger.warn("Tried to unexport PIR but it seems not to be initialized");
      await this.emit(true, undefined, 'leaving');
    }
  }

  async emit(err: Error | null, status: number | undefined, type: string) {
    if (err) {
      this.logger.error(`PIR sensor returned error for reading type '${type}' with status '${status}'`);
      this.logger.error(err);
      await this.presenceService.feed(undefined, type);
    }
    else {
      this.logger.info(`PIR is emitting status type '${type}' with value '${status}'`);
      await this.presenceService.feed(status, type);
    }
  }
}

export default PIR;
