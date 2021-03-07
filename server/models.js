const mongoose = require('mongoose')

const Time = mongoose.model('Time', { start: Date, end: Date })

module.exports = { Time }
