
const express = require('express')
const winston = require('winston')
const app = express()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/validation')()
require('./startup/prod')(app)
const {host, port} = require('./startup/config')


if (process.env.NODE_ENV != 'test') {
    app.listen(port, host, () =>{ winston.info(`Server instance running on http://${host}:${port}`)})
}

module.exports = app