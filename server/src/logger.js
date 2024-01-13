import winston from 'winston';
// import config from './config'; // Jeśli używasz konfiguracji, możesz ją zaimportować

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      // level: config.logging.level,
      levels: winston.config.npm.levels,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export default logger;
