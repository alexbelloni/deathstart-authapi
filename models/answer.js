const mongoose = require('mongoose');

//Schema is the structure
const answerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
}, { timestamps: true })

//Model is the communication interface
module.exports = { schema: answerSchema, model: mongoose.model('Answer', answerSchema) }

