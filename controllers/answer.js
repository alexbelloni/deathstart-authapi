const { model } = require('../models/answer');

const Answer = () => {
    function fromDatabase({ res, error, obj }) {
        const { _id, title, isCorrect, question } = res || {};
        return { id: _id, title, isCorrect, error, question };
    }
    
    async function read(id) {
        if (!id) {
            const res = await model.find();

            return res.map((obj, index) => {
                return fromDatabase({ res: obj });
            })
        } else {
            return new Promise((resolve, reject) => {
                model.findOne({ _id: id })
                    //.populate('user')
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

module.exports = Answer();