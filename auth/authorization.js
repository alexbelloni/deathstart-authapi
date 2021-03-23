const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const Authorization = () => {
    function set(app) {
        app.use((req, res, next) => {
            const hdrs = req.headers;
            if (hdrs && hdrs.authorization && hdrs.authorization.split(' ')[0] === 'JWT') {
                jsonwebtoken.verify(hdrs.authorization.split(' ')[1], process.env.AUTH_KEY, (err, decode) => {
                    req.user = err ? undefined : decode
                    next();
                })
            } else {
                req.user = undefined
                next();
            }

        })
    }

    function login(req, res) {
        const query = User.where({ email: req.body.email });
        query.findOne(function (error, user) {
            if (error) {
                res.status(401).json({ error });
            } else if (user) {
                if (!bcrypt.compareSync(req.body.password, user.hash)) {
                    res.status(401).json({ error: 'user or password invalid.' });
                } else {
                    const {email, name, avatar, country} = user;
                    res.json({ email, name, avatar, country, token: jsonwebtoken.sign(user.email, process.env.AUTH_KEY) })
                }
            } else {
                res.status(401).json({ error: 'user or password invalid.' });
            }
        });
    }

    return {
        set,
        login
    }
}

module.exports = Authorization();
