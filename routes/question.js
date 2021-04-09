const auth = require('../controllers/auth');
const controller = require('../controllers/question');

module.exports = (app) => {
    app.get('/questions', auth.requireLogin, (req, res) => {
        controller.read().then(u => res.json(u));
    });
}

