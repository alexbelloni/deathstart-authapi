const { model } = require('../models/evaluator');
const User = require('./user');

const Evaluator = () => {
    function fromDatabase({res, error, user}) {
        const { _id, cnpj, company, title } = res || {};
        return { id: _id, cnpj, company, title, error, user };
    }
    function toDatabase(req) {
        const { userId, cnpj, company, title } = req;
        return { _userId: userId, cnpj, company, title };
    }
    async function read(id) {
        if (!id) {
            const res = await model.find();

            const user = await User.read(res._userId);
            if (!user.id) {
                return fromDatabase({}, "evaluator user not found");
            }

            return res.map(r => fromDatabase({res: r, user}));
        } else {
            const res = await model.findById(id);

            const user = await User.read(res._userId);
            if (!user.id) {
                return fromDatabase({}, "evaluator user not found");
            }

            return fromDatabase({res, user});
        }
    }
    async function update(id, obj) {
        if (id) {
            const res = await model.findByIdAndUpdate(id, obj, { new: true });
            return fromDatabase(res || {});
        } else {
            return fromDatabase({}, "id required");
        }
    }
    async function deleteId(id) {
        if (id) {
            const res = await model.deleteOne({ _id: id });
            return res.deletedCount > 0 ? { id } : fromDatabase({}, "delete failed");
        } else {
            return fromDatabase({}, "id required");
        }
    }
    async function create(obj) {
        const newObj = toDatabase(obj);
        if (!newObj._userId) {
            return fromDatabase({}, "userId required");
        }

        const user = await User.read(newObj._userId);
        if (!user.id) {
            return fromDatabase({}, "evaluator user not found");
        }

        const newEvaluator = new model(newObj);
        const res = await newEvaluator.save(newObj);
        return fromDatabase({res, user });
    }
    return {
        create,
        read,
        update,
        deleteId
    }
}

module.exports = Evaluator();