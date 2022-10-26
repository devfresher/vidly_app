
const express = require('express')
const winston = require('winston')
const app = express()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/validation')()
const {hostname, port} = require('./startup/config')


const server  = app.listen(port, () =>{ winston.info(`Server instance running on http://${hostname}:${port}`)})
module.exports = server