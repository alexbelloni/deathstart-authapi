const mongoose = require('mongoose');

//Schema is the structure
const userSchema = new mongoose.Schema({
    rhCode: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String
    },
    gender: {
        type: String
    },
    avatar: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    cep: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    validationCode: {
        type: String
    },
    birthday: {
        type: Date
    },
    cpf: {
        type: String
    },
    status: {
        type: String
    },
    address: {
        type: String
    },
    addressNumber: {
        type: Number
    },
    addressMore: {
        type: String
    },
    passcode: {
        type: String
    },
}, { timestamps: true })

//Model is the communication interface
module.exports = { schema: userSchema, model: mongoose.model('User', userSchema) }

