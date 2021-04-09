const auth = require('../controllers/auth');
const controller = require('../controllers/answer');

module.exports = (app) => {
    app.get('/answers', auth.requireLogin, (req, res) => {
        controller.read().then(u => res.json(u));
    });
}

