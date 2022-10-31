const Joi = require('joi');
const { default: mongoose } = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    },
    dateCreated: {  
        type: Date,
        default: Date.now,
        required: true
    }
})
movieSchema.methods.increaseStock = function () {
    this.numberInStock += 1
}

const Movie = mongoose.model('movie', movieSchema)

function validateMovie(movie) {
    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
        genreId: Joi.objectId()
            .required(),
        numberInStock: Joi.number()
            .min(1),
        dailyRentalRate: Joi.number()
            .min(1)
    })

    return schema.validate(movie);
}

exports.Movie = Movie
exports.validate = validateMovie