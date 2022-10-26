const config = require('config');

module.exports.hostname = "127.0.0.1";
module.exports.port = config.get("port") || 5000;