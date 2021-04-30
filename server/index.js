const container = require('./container');

// const app = container.resolve('config');
// console.log(app)

const app = container.resolve('app')
const logger = container.resolve('logger')

app
  .start()
  .catch((error) => {
    console.log(error)
    app.logger.error(error);
    // app.stop()
    // process.exit()
  });


  process.stdin.resume(); //so the program will not close instantly

  async function exitHandler(options, exitCode) {
    // await app.stop(options, exitCode)
    // if (options.cleanup) console.log('clean');

    if(typeof exitCode == "object") {
      console.log('x')
    }
    console.log(exitCode)

    exitCode
      = (exitCode || exitCode === 0)
      ? `with exit code ${exitCode}`
      : `without exit code`

    logger.info(`Closing app ${exitCode}`)

    if (options.exit) process.exit()
  }

  //do something when app is closing
  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true})); //catches ctrl+c event
  process.on('SIGUSR1', exitHandler.bind(null, {exit:true})); // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR2', exitHandler.bind(null, {exit:true})); // catches "kill pid" (for example: nodemon restart)
  process.on('uncaughtException', exitHandler.bind(null, {exit:true})); //catches uncaught exceptions

