const config = require('config');
const mongoose = require('mongoose');

mongoose.connect(config.get('dbConfig.url'))
    .then(() => {console.log("Connected to DB");})
    .catch((err) => {console.log("Error connecting to the DB", err);})

exports.db = mongoose