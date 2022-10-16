const Joi = require('joi');
const { db } = require('./db');

const Customer = db.model('Customer', new db.Schema({
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
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    }
}))

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(255)
            .required(),

        isGold: Joi.boolean(),
        phone: Joi.string().min(11).max(11).required(),
    })

    return schema.validate(customer);
}

exports.Customer = Customer
exports.validate = validateCustomer