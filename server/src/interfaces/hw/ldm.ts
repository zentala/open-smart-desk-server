const VL53L0X = require('vl53l0x');

class LDM { // Laser Distance Meter
  private config: any; // Wstaw odpowiedni typ dla config
  private emitter: any; // Wstaw odpowiedni typ dla emitter
  private helpers: any; // Wstaw odpowiedni typ dla helpers
  private logger: any; // Wstaw odpowiedni typ dla logger
  private args: any[]; // Wstaw odpowiedni typ dla args

  constructor({ config, emitter, helpers, logger }: { config: any, emitter: any, helpers: any, logger: any }) {
    this.config = config;
    this.emitter = emitter;
    this.helpers = helpers;
    this.logger = logger;

    // Optionally, try developing with an i2cdriver!
    // this.args = ['/dev/tty.usbserial-DO01INSW', 0x29, 'i2cdriver/i2c-bus']
    this.args = [1, 0x29];
  }

  async start() {
    this.logger.info('LDM initializing...');
    await this.initialCheck();
  }

  async initialCheck() {
    const height = await this.measureAverage();
    this.logger.info(`Initial height measurement: ${height}`);
  }

  async measureAverage(measures: number = 10): Promise<number | boolean> {
    this.logger.info('LDM will try to measure average');
    let results: number[] = [];
    let previousMeasuredNumber = 0;
    let lastWrongLaserNumber: number | undefined;
    let doMeasure = true;
    let measureCounter = 0;
    let errorsAmount = 0;

    return await VL53L0X(...this.args)
      .then(async (vl53l0x: any) => {
        await vl53l0x.setMeasurementTimingBudget(200000);
        while (doMeasure) {
          let measuredHeight = await vl53l0x.measure();

          if (measuredHeight && this.helpers.inNumberInRange(measuredHeight, ...this.config.desk.heightRange)) {

            // we are looking for few readings to get average
            if (previousMeasuredNumber !== measuredHeight) {
              this.logger.debug(`LDM new range measured: ${measuredHeight}`);
              results.push(measuredHeight);
              previousMeasuredNumber = measuredHeight;
              this.emitter.emit('laser', measuredHeight);

              // if we have enough different readings, we can stop
              measureCounter += 1;
              if (measureCounter >= measures) {
                doMeasure = false;
                const average = this.helpers.roundedAverage(results);
                this.emitter.emit('laser', average);
                this.logger.info(`LDM average ${average}mm from ${measures} readings: ${results.join('mm, ').toString()}mm`);
                return average;
              }
            }

          } else {
            // counting errors so we can stop process if needed
            errorsAmount += 1;
            if (errorsAmount > 100) {
              this.logger.error(`LDM detected more than 100 reading errors. Quitting...`);
              doMeasure = false;
              return false;
            }
            if (lastWrongLaserNumber !== measuredHeight) {
              lastWrongLaserNumber = measuredHeight;
              this.logger.warn(`LDM readed wrong range: ${measuredHeight}`);
            }
          }
        }
      })
      .catch((err: Error) => {
        console.error('LDM Error: ' + err);
        return false;
      });
  }
}

export default LDM;
