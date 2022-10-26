const Joi = require('joi');
const { default: mongoose } = require('mongoose');

const Rental = mongoose.model('rental', new mongoose.Schema({
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
}))

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })

    return schema.validate(rental);
}

exports.Rental = Rental
exports.validate = validateRental