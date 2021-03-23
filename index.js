const express = require('express');
require('dotenv').config();
const logger = require('./logs/logger');
const cors = require('cors');

const app = express();

logger(app);

app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
  });
  
app.use(express.json());

require('./auth/authorization').set(app);

app.get('/', (req, res) => {
    res.send('Hi, this is AuthAPI!');
});

require('./routes/user')(app);
require('./auth/login').set(app);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(r => {
        const port = process.env.PORT || 5005;
        app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
    })
    .catch(e => console.log(e));