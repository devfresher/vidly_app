const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    }
})
const Genre = mongoose.model('genre', genreSchema)

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
    })

    return schema.validate(genre);
}

exports.Genre = Genre
exports.validate = validateGenre
exports.genreSchema = genreSchema