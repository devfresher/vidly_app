const request = require('supertest')
const { Genre } = require('../../../models/genre')
const mongoose = require('mongoose')
const { User } = require('../../../models/user')
let server

describe("/api/genres", () => {

    beforeEach (() => { server = require('../../../index') })
    afterEach (async () => { 
        server.close()
        await Genre.remove({})
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
            const id = new mongoose.Types.ObjectId()

            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        })

        it("should return the genre with the given ID", async() => {
            const id = new mongoose.Types.ObjectId()
            const genre = new Genre({_id: id, name: "Gnere1"})
            await genre.save()

            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({_id: id});
        })
    })

    describe("POST /", () => {
        it("should return 401 error if user not authorized", async() => {
            
            const res = await request(server)
                .post('/api/genres')
                .send({name: "Genre1"})

            expect(res.status).toBe(401)
        })

        it("should return 400 error if genre.name is less than 5 characters", async() => {
            const token = new User().generateAuthToken()

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: "a"})

            expect(res.status).toBe(400)
        })

        it("should return 400 error if genre.name is greater than 50 characters", async() => {
            const token = new User().generateAuthToken()
            const name = new Array(52).join('a')

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name })

            expect(res.status).toBe(400)
        })

        it("should save the genre if it is valid", async() => {
            const token = new User().generateAuthToken()
            const name = new Array(11).join('a')

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name })
            
            const genre = await Genre.findOne({name: name})                

            expect(genre).not.toBeNull()
        })

        it("should return the genre if it is saved", async() => {
            const token = new User().generateAuthToken()

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'Genre1' })
            
            const genre = await Genre.findOne({name: 'Genre1'})                

            expect(genre).toHaveProperty('_id')
            expect(genre).toHaveProperty('name', 'Genre1')
        })
    })
}) 