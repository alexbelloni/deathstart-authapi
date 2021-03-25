const auth = require('../controllers/auth');
const controller = require('../controllers/evaluator');

module.exports = (app) => {
    app.get('/evaluators', auth.requireLogin, (req, res) => {
        controller.read().then(u => res.json(u));
    });

    app.route('/evaluator/:id')
        .get(auth.requireLogin, (req, res) => {
            controller.read(req.params.id).then(u => res.json(u));
        })
        .put(auth.requireLogin, (req, res) => {
            controller.update(req.params.id, req.body).then(u => res.json(u));
        })
        .delete(auth.requireLogin, (req, res) => {
            controller.deleteId(req.params.id).then(u => res.json(u));
        });

    app.post('/evaluator', (req, res) => {
        controller.create(req.body).then(u => res.json(u));
    });
}

