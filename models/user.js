const Joi = require('joi');
const { db } = require('./db');

const User = db.model('User', new db.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    }
}))

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),

        email: Joi.string().required().email().min(6).max(255),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(user);
}

exports.User = User
exports.validate = validateUser