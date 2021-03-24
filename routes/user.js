const User = require('../models/user');
const bcrypt = require('bcrypt');
const login = require('../auth/login');

module.exports = (app) => {
    app.get('/users', login.requireLogin, (req, res) => {
        User.find()
            .then(r => {
                res.json(r);
            })
            .catch(e => console.log(e));
    });

    app.route('/user/:id')
        .get(login.requireLogin, (req, res) => {
            User.findById(req.params.id)
                .then(r => {
                    res.json(r);
                })
                .catch(e => console.log(e));
        })
        .put((req, res) => {
            User.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
                res.json(doc);
            })
        })
        .delete((req, res) => {
            User.deleteOne({ _id: req.params.id }, (err, doc) => {
                res.json({ deletedCount: doc.deletedCount });
            })
        });

    app.post('/user', (req, res) => {
        const { name, email, password, country } = req.body;
        bcrypt.hash(password, 10, function (err, hash) {
            const newUser = new User({
                name,
                email,
                country,
                hash
            });
            newUser.save()
                .then(r => {
                    res.json(r);
                })
                .catch(e => console.log(e));
        });
    });
}

