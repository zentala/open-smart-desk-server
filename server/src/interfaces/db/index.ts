import mongoose from 'mongoose';

class DB {
  private config: any; // Wstaw odpowiedni typ dla config
  private logger: any; // Wstaw odpowiedni typ dla logger

  constructor({ config, logger }: { config: any, logger: any }) {
    this.config = config;
    this.logger = logger;
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      mongoose
        .connect(this.config.db.uri, this.config.db.options)
        .then(() => {
          this.logger.info(`Connected with MongoDB at ${this.config.db.uri}`);
          resolve();
        })
        .catch((err) => {
          this.logger.error(err);
          this.logger.error(`Unable to connect MongoDB. Check if deamon is started...`);
          reject();
        });
    });
  }
}

export default DB;
