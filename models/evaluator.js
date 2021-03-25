const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cnpj: {
        type: String
    },
    company: {
        type: String
    },
    title: {
        type: String
    },
}, { timestamps: true })

//Model is the communication interface
module.exports = { schema: mySchema, model: mongoose.model('Evaluator', mySchema) }