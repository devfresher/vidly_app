const request = require('supertest')
const { Genre } = require('../../../models/genre')
const mongoose = require('mongoose')
const { User } = require('../../../models/user')
let server, token, name

describe("/api/genres", () => {
    jest.setTimeout(10000*10);

    beforeEach (() => { 
        server = require('../../../index') 
    })
    afterEach (async () => { 
        await Genre.deleteMany({})
        // await server.close()
    })

    describe("GET /", () => {
        it("should return 404 if no document is found", async() => {
            const res = await request(server).get('/api/genres/')
            expect(res.status).toBe(404)
        })

        it("should return all genres", async() => {
            await Genre.collection.insertMany([
                {name: "Genre1"},
                {name: "Genre2"},
            ])

            const res = await request(server).get('/api/genres/')
            expect(res.status).toBe(200)
            expect(res.body[0]).toMatchObject({ name: "Genre1"})
        })
    })

    describe("GET /:id", () => {
        it("should return 404 if id not found", async() => {
            const id = new mongoose.Types.ObjectId()

            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(404)
        })

        it("should return 400 if genre id is not a valid object_id", async() => {
            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(400)
        })

        it("should return the genre with the given ID", async() => {
            const id = new mongoose.Types.ObjectId()
            const genre = new Genre({_id: id, name: "Genre1"})
            await genre.save()

            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({_id: id});
        })
    })

    describe("POST /", () => {

        beforeEach(() => {
            token = new User().generateAuthToken()
            name = new Array(10).join('a')
        })

        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name})
        }

        it("should return 401 error if user not authorized", async() => {
            token = ''
            const res = await exec();
            expect(res.status).toBe(401)
        })

        it("should return 400 error if genre.name is less than 5 characters", async() => {
            name = 'a'
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it("should return 400 error if genre.name is greater than 50 characters", async() => {
            name = new Array(57).join('a')
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it("should save the genre if it is valid", async() => {
            await exec()
            const genre = await Genre.findOne({name: name})                
            expect(genre).not.toBeNull()
        })

        it("should return the genre if it is saved", async() => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', name)
        })
    })

    describe("PUT /:id", () => {
        let genreId, token, name

        beforeEach(async() => {
            token = new User().generateAuthToken()
            name = Array(10).join('a')
            genreId = mongoose.Types.ObjectId()

            const genre = new Genre({
                _id: genreId,
                name: '12345',
            })
            await genre.save()
        })

        const exec = () => {
            return request(server)
                .put('/api/genres/'+genreId)
                .set('x-auth-token', token)
                .send({name})
        }

        it("should return 401 if user is not logged in", async () => {
            token = ''
            const result = await exec()

            expect(result.status).toBe(401)
        })

        it("should return 400 if genre.name is less than 5 characters", async () => {
            name = '123'
            const result = await exec()

            expect(result.status).toBe(400)
        })

        it("should return 400 if genre.name is greater than 50 characters", async () => {
            name = Array(70).join('a')
            const result = await exec()

            expect(result.status).toBe(400)
        })

        it("should return 404 if genre not found", async () => {
            genreId = mongoose.Types.ObjectId()
            const result = await exec()

            expect(result.status).toBe(404)
        })

        it("should return the updated genre if valid", async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({name})
        })
    })

    describe("Delete /:id", () => {
        let genreId, token, user, genre

        beforeEach(async() => {
            token = new User().generateAuthToken()
            genreId = new mongoose.Types.ObjectId()

            genre = new Genre({
                _id: genreId,
                name: '12345',
            })
            await genre.save()

            user = new User({
                name: 'New User',
                isAdmin: true,
                email: 'hello@g.com',
                password: '12345'
            })
            await user.save()

            token = user.generateAuthToken()
        })

        afterEach(async () => {
            await User.deleteMany({})
        })

        const exec = () => {
            return request(server)
                .delete('/api/genres/'+genreId)
                .set('x-auth-token', token)
        }

        it("should return 401 if user is not logged in", async () => {
            token = ''
            const result = await exec()

            expect(result.status).toBe(401)
        })

        it("should return 403 if user is not an admin", async () => {
            token = new User({
                name: 'New User',
                email: 'hello@g.com',
                password: '12345'
            }).generateAuthToken()

            const result = await exec()

            expect(result.status).toBe(403)
        })

        it("should return 404 if genre not found", async () => {
            genreId = mongoose.Types.ObjectId()
            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should delete the genre", async () => {
            await exec()
            deletedGenre = await Genre.findById(genreId)

            expect(deletedGenre).toBeNull()
        })

        it("should return the deleted genre", async () => {
            const res = await exec()

            expect(res.body).toMatchObject({_id: genreId})
        })
    })
}) 