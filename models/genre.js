const Joi = require('joi')
const { db } = require('./db')

const genreSchema = new db.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    }
})
const Genre = db.model('genre', genreSchema)

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(255)
            .required(),
    })

    return schema.validate(genre);
}

exports.Genre = Genre
exports.validate = validateGenre
exports.genreSchema = genreSchema