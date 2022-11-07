const jwt = require("jsonwebtoken")
const config = require("config")
const { User, hashPassword, validate } = require("../../../models/user")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');


describe("user.generateAuthToken", () => {
    it("should return a valid jwt token", () => {
        const payLoad = {_id : new mongoose.Types.ObjectId(), isAdmin: true}
        const user = new User(payLoad)
        const token = user.generateAuthToken()
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))

        expect(decoded).toMatchObject(payLoad)

    })
})

describe("hashPassword", () => {
    it("should return true when compare a password string to it hash", async () => {
        const password = "12345"
        const hashedPassword = await hashPassword(password)

        const compare = await bcrypt.compare(password, hashedPassword)

        expect(compare).toBe(true)
    })
})

describe("validateUser", () => {
    let name, email, password

    beforeEach(() => {
        name = 'aaaaaa'
        email = 'email@email.com'
        password = '12345'
    })

    const createUser = () => {
        return new User({ name, email, password })
    }

    it("should return string.empty error if name is not provided", async () => {      
        name = ''
        const result = validate(createUser());

        expect(result.error.details[0].type).toEqual('string.empty')
    })

    it("should return validation error if name.length is less than 5", async () => {
        name = 'aaa'
        const result = validate(createUser());


        expect(result.error.details[0].type).toEqual('string.min')
    })

    it("should return validation error if name.length is greater than 50", async () => {
        name = Array(59).join('a')
        const result = validate(createUser());

        expect(result.error.details[0].type).toEqual('string.max')
    })

    it("should return validation error if name.length is greater than 50", async () => {
        name = Array(59).join('a')
        const result = validate(createUser());

        expect(result.error.details[0].type).toEqual('string.max')
    })
})