module.exports = function (req, res, next) {
    if( !req.user.isAdmin ) return res.status(403).send("Access denied. You do not have permission to perform this action")
    next()
}