const jwt = require('jsonwebtoken')
const request = require('supertest')
const config = require('config')
const _ = require('lodash')
const { User, hashPassword } = require('../../../models/user')


describe("POST /", () => {
    server = require('../../../index')
    let user, email, password, hashedPassword

    beforeEach(async () => {
        email = "test@test.com"
        password = "12345"
        hashedPassword = await hashPassword(password)

        user = new User({
            name: "12345",
            email,
            password: hashedPassword
        })
        await user.save()
    })

    afterEach(async () => {
        await User.deleteMany({})
    })


    const exec = () => {
        return request(server)
            .post('/api/auth')
            .send({ email, password })
    }

    it("should return 400 if email not provided", async() => {
        email = ''
        const result = await exec()

        expect(result.status).toBe(400)
    })

    it("should return 400 if email not valid", async() => {
        email = '12345'
        const result = await exec()

        expect(result.status).toBe(400)
    })

    it("should return 400 if password not provided", async() => {
        password = ''
        const result = await exec()

        expect(result.status).toBe(400)
    })

    it("return 400 if user does not exist with wrong email", async() => {
        email = 'tester@test.com'
        const result = await exec()

        expect(result.status).toBe(400)
    })

    it("return 400 if user does not exist with wrong password", async() => {
        password = '1234'
        const result = await exec()

        expect(result.status).toBe(400)
    })

    it("should return a valid jwt token and 200 status code", async() => {
        const res = await exec()

        const payload = jwt.verify(res.body, config.get('jwtPrivateKey'))
        
        expect(res.status).toBe(200)
        expect(payload).toMatchObject(_.pick(user, ['_id', 'isAdmin']))
    })
})