const request = require('supertest');
const { mongoose } = require('mongoose');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const moment = require('moment/moment');
const { Movie } = require('../../../models/movie');

describe('Returns API', () => {
    let rental, movie
    let server, customerId, movieId, token;

    const exec = async () => {
        return await request(server)
            .post('/api/returns/')
            .set('x-auth-token', token)
            .send({customerId, movieId})
    }

    beforeEach(async () => {
        server = require('../../../index')
        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()
        token = new User().generateAuthToken()

        movie = new Movie({
            _id: movieId,
            dailyRentalRate: 2,
            name: "12345",
            numberInStock: 10,
            genre: { name: "12345"}
        })
        movie.save()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "aaaaa",
                phone: "11111111111"
            },
            movie: {
                _id: movieId,
                name: "12345",
                dailyRentalRate: 2
            }
        })

        await rental.save();
    })

    afterEach(async () => {
        await Rental.deleteMany({})
        await Movie.deleteMany({})
    })

    it('should return 401 if user is not logged in', async() => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it('should return 400 if customer id is not provided', async() => {
        customerId = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 400 if movie id is not provided', async() => {
        movieId = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 404 if no rental found for movie/customer provided', async() => {
        await Rental.deleteMany({})

        const res = await exec()
        expect(res.status).toBe(404)
    })

    it('should return 400 if return is already processed', async() => {
        rental.dateReturned = new Date()
        rental.save()

        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 200 if request is valid', async() => {
        const res = await exec()
        expect(res.status).toBe(200)
    })

    it('should set the returned date', async() => {
        await exec()

        const updatedRental = await Rental.findById(rental._id)

        const dateDiff = moment().diff(updatedRental.dateReturned, 'seconds')

        expect(dateDiff).toBeLessThan(10 * 1000)
    })

    it('should calculate the rental fee', async() => {
        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()

        await exec()

        const updatedRental = await Rental.findById(rental._id)

        expect(updatedRental.rentalFee).toEqual(14)
    })

    it('should increase the movie.numberInStock', async() => {
        await exec()

        const updatedMovie = await Movie.findById(movie._id)

        expect(updatedMovie.numberInStock).toEqual(movie.numberInStock + 1)
    })

    it('should return the rental object', async() => {
        const res = await exec()

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(
                ['dateOut', 'dateReturned', 'customer', 'movie', 'rentalFee']
            )
        )
    })
})