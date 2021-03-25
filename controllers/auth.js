const jsonwebtoken = require('jsonwebtoken');
const { model } = require('../models/user');
const bcrypt = require('bcrypt');

const Auth = () => {
    function verifyHeaders(app) {
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

    function requireLogin(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.status(401).json({ error: "unauthorized" });
        }
    }

    function sendPasscode(req, next) {
        // generate passcode and save to user
        // send a passcode to req.email
        next();
    }

    function verifyPasscode(req, next) {
        // get user and compare passcodes
        next();
    }

    function login(email, password) {
        return new Promise((resolve, reject) => {
            const query = model.where({ email });
            query.findOne(function (error, user) {
                if (error) {
                    reject(error);
                } else if (user) {
                    if (!bcrypt.compareSync(password, user.hash)) {
                        reject({ error: 'e-mail or password invalid.' });
                    } else {
                        const { _id, email, name, avatar, country } = user;
                        resolve({ id: _id, email, name, avatar, country, token: jsonwebtoken.sign(user.email, process.env.AUTH_KEY) })
                    }
                } else {
                    reject({ error: 'e-mail or password invalid.' });
                }
            });
        })

    }

    return {
        verifyHeaders,
        requireLogin,
        sendPasscode,
        verifyPasscode,
        login
    }
}

module.exports = Auth();
