const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');


module.exports = function () {
    winston.add(
        new winston.transports.File({
            filename: './logs/uncaughtException.log'
        })
    )

    winston.add(
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true,
        })
    )
}