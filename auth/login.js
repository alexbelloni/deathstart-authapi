const authorization = require('./authorization');

const login = () => {
    function set(app) {
        app.post('/login', (req, res) => {
            authorization.login(req, res);
        });
    }

    function requireLogin(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.status(401).json({ error: "unauthorized" });
        }
    }

    return {
        set,
        requireLogin
    }
}

module.exports = login();

