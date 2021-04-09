const mongoose = require('mongoose');

//Schema is the structure
const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    order: {
        type: Number
    },
    answers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    }]
}, { timestamps: true })

//Model is the communication interface
module.exports = { schema: questionSchema, model: mongoose.model('Question', questionSchema) }

