const { model } = require('../models/user');
const bcrypt = require('bcrypt');
const evaluatorController = require('./evaluator');

const User = () => {
    function fromDatabase({ res, evaluator, error }) {
        const { _id, name, email, country } = res || {};
        return { id: _id, name, email, country, evaluator, error };
    }
    function toDatabase(req) {
        const { name, email, password, country } = req;
        return { name, email, password, country };
    }
    async function read(id) {
        if (!id) {
            const result = [];
            const res = await model.find();
            for (let i = 0; i < res.length; i++) {
                const user = res[i];
                const evaluator = await evaluatorController.readByUserId(user._id)
                result.push(fromDatabase({ res: user, evaluator }));
            }
            return result;
        } else {
            try {
                const res = await model.findById(id);
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

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async function create(obj) {
        const user = toDatabase(obj);
        if (!user.password) {
            return fromDatabase({ error: "password required" });
        }
        if (!validateEmail(user.email)) {
            return fromDatabase({ error: "email invalid" });
        }

        const exists = await model.findOne().where({email: user.email});
        if (exists) {
            return fromDatabase({ error: "email already is used" });
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