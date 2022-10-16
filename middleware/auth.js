const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')
    if( !token ) return res.status(401).send("Access denied. No auth token provided")

    try {
        const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decodedToken
        next()
    } catch (error) {
        return res.status(400).send(error.message)
    }
}