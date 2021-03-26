const { model } = require('../models/evaluator');
const User = require('./user');

const Evaluator = () => {
    function fromDatabase({ res, error, user }) {
        const { _id, cnpj, company, title } = res || {};
        return { id: _id, cnpj, company, title, error, user };
    }
    function toDatabase(req) {
        const { cnpj, company, title } = req;
        return { cnpj, company, title };
    }
    async function read(id) {
        if (!id) {
            const res = await model.find().populate('user');

            return res.map(evaluator => {
                const retEval = fromDatabase({ res: evaluator });
                const retUser = User.fromDatabase({ res: evaluator.user });
                return { ...retEval, user: retUser }
            })
        } else {
            return new Promise((resolve, reject) => {
                model.findOne({ _id: id })
                    .populate('user')
                    .exec(function (err, evaluator) {
                        if (err) {
                            reject(err);
                            return
                        } else {
                            const retEval = fromDatabase({ res: evaluator });
                            const retUser = User.fromDatabase({ res: evaluator.user });
                            resolve({ ...retEval, user: retUser });
                        }
                    });
            });
        }
    }
    async function readByUserId(id) {
        const res = await model.findOne().where({ user: { _id: id } });
        return res ? fromDatabase({ res }) : null;
    }
    async function update(id, obj) {
        if (id) {
            const res = await model.findByIdAndUpdate(id, obj, { new: true });
            return fromDatabase(res || {});
        } else {
            return fromDatabase({ error: "id required" });
        }
    }
    async function deleteId(id) {
        if (id) {
            const res = await model.deleteOne({ _id: id });
            return res.deletedCount > 0 ? { id } : fromDatabase({ error: "delete failed" });
        } else {
            return fromDatabase({ error: "id required" });
        }
    }
    async function create(obj) {
        const user = await User.create(obj.user);
        if (user.error) {
            return fromDatabase({ error: user.error });
        }

        const verified = toDatabase(obj);
        const evaluator = new model({ ...verified, user: user.id });

        const newEvaluator = await evaluator.save();

        return fromDatabase({ res: newEvaluator, user });
    }
    return {
        create,
        read,
        update,
        deleteId,
        fromDatabase,
        readByUserId
    }
}

module.exports = Evaluator();