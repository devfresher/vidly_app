const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment/moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                minlength: 11,
                maxlength: 11
            },
        }),

        required: true
    },
    movie: {
        type: new mongoose.Schema({
            name: {
                type: String,
                trim: true,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            numberInStock: {
                type: Number,
                default: 0,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                default: 0,
                required: true
            },
        }),
        
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})
rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
}
rentalSchema.methods.return = function () {
    const numberOfDays = moment().diff(this.dateOut, 'days')

    this.dateReturned = moment().toDate()
    this.rentalFee = numberOfDays * this.movie.dailyRentalRate
    this.movie.numberInStock += 1
}

const Rental = mongoose.model('rental', rentalSchema)

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })

    return schema.validate(rental);
}

exports.Rental = Rental
exports.validate = validateRental