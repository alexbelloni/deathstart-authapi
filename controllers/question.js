const { model } = require('../models/question');
const Answer = require('./answer');

const Question = () => {
    function fromDatabase({ res, error, answers }) {
        console.log(answers)
        const { _id, order, title } = res || {};
        return { id: _id, order, title, answers, error };
    }
    
    async function read(id) {
        if (!id) {
            const answers = await Answer.read();

            const res = await model.find();
            return res.map((obj, index) => {
                const arr = answers.filter(a => a.question.toString() == obj._id.toString());
                return fromDatabase({ res: obj, answers: arr });
            })
        } else {
            return new Promise((resolve, reject) => {
                model.findOne({ _id: id })
                    .exec(function (err, obj) {
                        if (err) {
                            reject(err);
                            return
                        } else {
                            const retEval = fromDatabase({ res: obj });
                            resolve(retEval);
                        }
                    });
            });
        }
    }
    return {
        read,
        fromDatabase,
    }
}

module.exports = Question();