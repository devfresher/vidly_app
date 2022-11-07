const request = require('supertest')
let server = require('../../../index')
const { User, hashPassword } = require('../../../models/user')
const _ = require('lodash')
const { default: mongoose } = require('mongoose')
const bcrypt = require('bcrypt')


describe("User API", () => {
    let user, userId, name, email, password, hashedPassword

    beforeEach(async () => {
        userId = new mongoose.Types.ObjectId()
        name = '12345'
        email = 'test@tester.com' 
        password = '123456'
        hashedPassword = await hashPassword(password)


        user = new User({
            _id: userId,
            name,
            email,
            password: password
        })
        await user.save()
    })

    afterEach(async () => {
        await User.deleteMany({})
    })




    describe("GET /", () => {
        const exec = () => {
            return request(server)
                .get('/api/users')
        }

        it("should return 204 if no user is found in the db", async () => {
            await User.deleteMany({})

            const res = await exec()
    
            expect(res.status).toBe(204)
        })

        it("should return the users from the db", async () => {
            const res = await exec()
            
            expect(res.body[0]).toHaveProperty('_id')
        })

    })

    describe("GET /me", () => {
        let token

        beforeEach(() => {
            token = user.generateAuthToken()
        })

        const exec = () => {
            return request(server)
                .get('/api/users/me')
                .set('x-auth-token', token)
        }
    
        it("should return 401 if user is not logged in", async () => {
            token = ''
    
            const res = await exec()
    
            expect(res.status).toBe(401)
        })

        it("should return 400 if invalid auth token is provided", async () => {
            token = 'aaaaaa'
    
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return authenticated user object", async () => {    
            const res = await exec()
    
            expect(res.status).toBe(200)

            expect(res.body).toMatchObject(_.pick(user, ['_id', 'name', 'email']))
        })
    
    })

    describe("GET /:id", () => {

        const exec = () => {
            return request(server)
                .get('/api/users/'+userId)
        }
    
        it("should return 404 if no user found", async () => {
            userId = new mongoose.Types.ObjectId()  
            const res = await exec()
    
            expect(res.status).toBe(404)
        })
    
        it("should return 400 if the userId is invalid", async () => {
            userId = 1
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return the user object", async () => {
            const res = await exec()
    
            expect(res.body).not.toBeNull()
        })
    })

    describe("POST /", () => {
        beforeEach(async () => {
            await User.deleteMany({})        
        })

        const exec = () => {
            return request(server)
                .post('/api/users')
                .send({ name, email, password })
        }
    
        it("should return 400 if name is not provided", async () => {
            name = ''
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if email is not provided", async () => {
            email = ''
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if password is not provided", async () => {
            password = ''
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if email already exist", async () => {
            user = new User({
                _id: userId,
                name, email, password
            })
            await user.save()

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should hash the password and replace", async () => {
            await exec()

            const userInDB = await User.findOne({ email: email })
            const compare = await bcrypt.compare(password, userInDB.password)

            expect(compare).toBe(true)
        })

        it("should set the token at the header of the response", async () => {
            const res = await exec()

            expect(res.header).toHaveProperty('x-auth-token')
        })
    
    })

    describe("PUT /:id", () => {
        let token

        beforeEach(() => {
            token = new User().generateAuthToken()
        })

        const exec = () => {
            return request(server)
                .put('/api/users')
                .set('x-auth-token', token)
                .send({ name, email, password })
        }
    
        it("should return 401 if user is not logged in", async () => {
            token = ''
            const res = await exec()
    
            expect(res.status).toBe(401)
        })

        it("should return 400 if email is not provided", async () => {
            email = ''
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if password is not provided", async () => {
            password = ''
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if email already exist", async () => {
            user = new User({
                _id: userId,
                name, email, password
            })
            await user.save()

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should hash the password and replace", async () => {
            await exec()

            const userInDB = await User.findOne({ email: email })
            const compare = await bcrypt.compare(password, userInDB.password)

            expect(compare).toBe(true)
        })

        it("should set the token at the header of the response", async () => {
            const res = await exec()

            expect(res.header).toHaveProperty('x-auth-token')
        })
    
    })
})
