const mongoose = require('mongoose');

//Schema is the structure
const userSchema = new mongoose.Schema({
    rhcode: {
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
    cellphone: {
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
    validationcode: {
        type: String
    },
    birthday: {
        type: String
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
    addressnumber: {
        type: String
    },
    addressmore: {
        type: String
    }
}, { timestamps: true })

//Model is the communication interface
module.exports = mongoose.model('User', userSchema);

