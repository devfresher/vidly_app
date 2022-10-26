const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
    mongoose.connect(config.get('dbConfig.url'))
        .then(() => { winston.info("Connected to DB"); })
}