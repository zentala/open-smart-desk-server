const pjson = require('../package.json')
const path = require('path')

const config = {
  version: pjson.version,
  http: {
    port: 8080,
    static: path.join(__dirname, '../../client')
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
    pins: [26, 19, 13, 6], // ground, top/bottom, bottom, top
    directions: {
      'stop': [1, 1, 1, 1],
      'up': [0, 1, 1, 0],
      'down': [0, 0, 0, 1],
    }
  },
  pir: {
    pin: 18,
    timeout: 60*1000, // ms; 60s here
    debug: false,
    dict: {
      '0': 'absent',
      '1': 'present',
      'undefined': 'unknown'
    }
  },
  desk: {
    memoryButtonsRange: [1,4],
    heightRange: [0,1500]
  }
}

module.exports = config
