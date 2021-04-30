const mongoose = require('mongoose');

class DB {
  constructor({ config, logger }) {
    this.config = config;
    this.logger = logger;
  }

  connect() {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(this.config.db.uri, this.config.db.options)
        .then(() => {
          this.logger.info(`Connected with MongoDB at ${this.config.db.uri}`)
          resolve();
        })
        .catch((err) => {
          this.logger.error(err)
          this.logger.error(`Unable to connect MongoDB. Check if deamon is started...`)
          reject();
        });
    });
  }

}

module.exports = DB;
