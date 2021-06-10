const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const path = require("path");
require('dotenv').config();
const {
    ExtractJwt,
    Strategy
} = require('passport-jwt');
const passport = require('passport');


const User = require("./models/user");
const apis = require("./apis");
const config = require("./config");


mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(success => {
    console.log("MongoDB connected!!!", config.db);
}).catch(err => {
    console.log("MongoDB connection failed!!!", err)
});

app.get("/", (req, res) => {
    res.send("listening");
})

app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3001;
const server = http.createServer(apis);

server.listen(port, () => console.log(`listening on port ${port}`));


