const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./user');

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json({
    limit: "1000kb"
}));

// app.use((req, res, next) => {
//     res.status(200).json({ message: 'it works' });
// })

app.use('/user', user);

module.exports = app;