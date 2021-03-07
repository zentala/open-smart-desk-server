const pjson = require('../package.json')
const path = require('path')

const config = {
  version: pjson.version,
  server: {
    port: 8080,
    static: path.join(__dirname, '../client')
  },
  db: {
    uri: 'mongodb://localhost:27017/desk',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  logging: {
    level: 'debug'
  },
  relay: {
    pins: [26, 20, 21],
    directions: { // 1st is now always in default position because is broken and I rewired it
      'stop': [1, 1, 1],
      'up': [1, 1, 0],
      'down': [1, 0, 0]
    }
  },
  pir: {
    pin: 18,
    timeout: 60*1000, // ms; 60s here
    debug: false
  }
}

module.exports = config
