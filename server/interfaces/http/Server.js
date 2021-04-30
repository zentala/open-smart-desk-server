const express = require('express')
// const fs = require('fs')
// const path = require('path')
// const walkSync = require("walk-sync")

class Server {
  constructor({ config, logger }) { // router
    this.config = config
    this.logger = logger
    this.express = express()

    this.express.disable('x-powered-by')
    // this.express.use(router)
    this.express.use(express.static(this.config.http.static))

    // app.get('/textures', function (req, res) {
    //   const texturesPath = path.join(__dirname, '../client/textures')
    //   if (!fs.existsSync(texturesPath))
    //     res.send([])
    //   else
    //     res.send(walkSync("./client/textures", {globs: ["**/*.png"]}))
    // })

    // app.use(function(req, res, next) {
    //   var err = new Error('Not Found')
    //   err.status = 404
    //   next(err)
    // })
  }

  start() {
    return new Promise((resolve) => {
      const http = this.express.listen(this.config.http.port, () => {
          const { port } = http.address()
          this.logger.info(`HTTP server started at port ${port}`)
          resolve(http)
        })
    })
  }
}

module.exports = Server
