const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');

const userSchema = new mongoose.Schema({
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get("jwtPrivateKey"))
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().required().email().min(6).max(255),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(user);
}

function validateUpdate(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50),
        email: Joi.string().required().email().min(6),
        password: Joi.string().min(6),
    })

    return schema.validate(user);
}

function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    })

    return schema.validate(req);
}

async function hashPassword (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

exports.User = User
exports.validate = validateUser
exports.validateLogin = validateLogin
exports.validateUpdate = validateUpdate
exports.hashPassword = hashPassword