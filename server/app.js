const express = require('express')
const config = require('./config')

const app = express()

app.use(express.static(config.server.static))
app.set('port',config.server.port);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
