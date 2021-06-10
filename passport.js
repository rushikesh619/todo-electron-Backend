const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwtStrategy = require('passport-jwt').Strategy;
const config = require("./config");

const cookieExtractor = async (req) => {
    let token = null;
    console.log("we are here");
    if (req && req.cookies) {
        token = await req.cookies["access_token"];
        console.log(token);
    }
    return token;
}

passport.use(new jwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.secret
}, (payload, done) => {
    User.findById({ _id: payload.sub }, (err, user) => {
        if (err) {
            return done(err), false;
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

passport.use(new localStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        user.comparePassword(password, done);
    })
}));
