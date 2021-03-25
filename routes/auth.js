const controller = require('../controllers/auth');

module.exports = (app) => {
    app.post('/login', (req, res) => {
        controller.login(req.body.email, req.body.password)
            .then(r => res.json(r))
            .catch(e => res.status(401).json(e))
    });

    app.post('/forgot', (req, res) => {
        controller.sendPasscode(req, (error) => {
            if (error) {
                res.status(401).json({ error });
            } else {
                res.status(200).send();
            }
        });
    });

    app.post('/passcode', (req, res) => {
        controller.verifyPasscode(req, (error) => {
            if (error) {
                res.status(401).json({ error });
            } else {
                res.status(200).send();
            }
        });
    });
}