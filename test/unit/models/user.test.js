const jwt = require("jsonwebtoken")
const config = require("config")
const { User } = require("../../../models/user")
const { default: mongoose } = require("mongoose")

describe("user.generateAuthToken", () => {
    it("should return a valid jwt token", () => {
        const payLoad = {_id : new mongoose.Types.ObjectId(), isAdmin: true}
        const user = new User(payLoad)
        const token = user.generateAuthToken()
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))

        expect(decoded).toMatchObject(payLoad)

    })
})