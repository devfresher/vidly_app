const request = require('supertest')
const { Genre } = require('../../../models/genre')
const mongoose = require('mongoose')
const { User } = require('../../../models/user')
let server, token, name

describe("/api/genres", () => {

    beforeEach (() => { 
        server = require('../../../index') 
    })
    afterEach (async () => { 
        await Genre.deleteMany({})
        server.close()
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

        it("should return 404 if genre id is not a valid object_id", async() => {
            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
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
}) 