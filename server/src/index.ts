import container from './container';

const app = container.resolve('app');
const logger = container.resolve('logger');

app
  .start()
  .catch((error: any) => { // Określenie typu 'error' jako 'any' - możesz użyć bardziej konkretnego typu, jeśli to możliwe
    console.log(error);
    app.logger.error(error);
  });

process.stdin.resume(); //so the program will not close instantly

async function exitHandler(options: any, exitCode: any) { // Określenie typów 'options' i 'exitCode' jako 'any' - dostosuj je do swoich potrzeb
  if (typeof exitCode == "object") {
    console.log('x');
  }
  console.log(exitCode);

  exitCode =
    (exitCode || exitCode === 0)
      ? `with exit code ${exitCode}`
      : `without exit code`;

  logger.info(`Closing app ${exitCode}`);

  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true })); //catches ctrl+c event
process.on('SIGUSR1', exitHandler.bind(null, { exit: true })); // catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR2', exitHandler.bind(null, { exit: true })); // catches "kill pid" (for example: nodemon restart)
process.on('uncaughtException', exitHandler.bind(null, { exit: true })); //catches uncaught exceptions
