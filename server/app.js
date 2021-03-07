const express = require('express')
const config = require('./config')
const fs = require('fs')
const path = require('path')
const walkSync = require("walk-sync")

const app = express()

app.use(express.static(config.server.static))
app.set('port',config.server.port);

app.get('/textures', function (req, res) {
  const texturesPath = path.join(__dirname, '../client/textures');
  if (!fs.existsSync(texturesPath))
    res.send([])
  else
    res.send(walkSync("./client/textures", {globs: ["**/*.png"]}))
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
