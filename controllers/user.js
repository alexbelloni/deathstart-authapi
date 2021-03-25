const { model } = require('../models/user');
const bcrypt = require('bcrypt');

const User = () => {
    function fromDatabase({ res, error }) {
        const { _id, name, email, country } = res || {};
        return { id: _id, name, email, country, error };
    }
    function toDatabase(req) {
        const { name, email, password, country } = req;
        return { name, email, password, country };
    }
    async function read(id) {
        if (!id) {
            const res = await model.find();
            return res.map(r => fromDatabase({ res: r }));
        } else {
            try {
                const res = await model.findById(id).populate('evaluator');;
                return fromDatabase({ res });
            } catch (e) {
                return fromDatabase({ error: e.message });
            }
        }
    }
    async function update(id, obj) {
        if (id) {
            const res = await model.findByIdAndUpdate(id, obj, { new: true });
            return fromDatabase({ res });
        } else {
            return fromDatabase({ error: "id required" },);
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
        const user = toDatabase(obj);
        if (!user.password) {
            return fromDatabase({ error: "password required" });
        }
        return new Promise((resolve, reject) => {
            bcrypt.hash(user.password, 10, function (err, hash) {
                const newUser = new model({
                    ...user,
                    hash
                });
                newUser.save(user)
                    .then(r => resolve(fromDatabase({ res: r })))
                    .catch(e => reject(fromDatabase({}, e)));
            });
        });
    }
    return {
        create,
        read,
        update,
        deleteId,
        fromDatabase
    }
}

module.exports = User();