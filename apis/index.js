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

app.use('/api/user', user);

app.get('*.*', express.static(__dirname + '/public', { maxAge: '1y' }));
// serve frontend paths
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, { root: __dirname + '/public' });
});

module.exports = app;