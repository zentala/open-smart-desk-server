const pjson = require('../package.json')
const path = require('path')

const config = {
  version: pjson.version,
  server: {
    port: 8080,
    static: path.join(__dirname, '../client')
  },
  logging: {
    level: 'debug'
  },
  relay: {
    pins: [26, 20, 21],
    directions: {
      "stop": [1, 1, 1],
      "up": [1, 0, 0],
      "down": [0, 0, 0]
    }
  },
  pir: {
    pin: 18,
    timeout: 60*1000, // ms; 60s here
    debug: false
  }
}

module.exports = config
