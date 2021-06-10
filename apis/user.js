const express = require('express');
const router = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken')
const passportConfig = require('../passport');
const userService = require('../services/userServices')
const config = require("../config/index");

// const signToken = userID => {
//     return JWT.sign({
//         iss: "booksouls",
//         sub: userID,
//     }, config.secret, { expiresIn: "1 day" });
// }

router.get('/', (req, res) => {
    res.status(200).json({ message: 'you are getting this from user' });
})

router.post("/register", async (req, res) => {
    console.log(req.body.user);
    try {
        if (req.body.user) {
            if (req.body.user.username && req.body.user.password) {
                const data = req.body.user;
                let user = await userService.createUser(data);
                res.status(200).json({ user: user ? user : null, success: true, message: "OK" });
            } else {
                throw {
                    message: "Not allowd!"
                }
            }
        } else {
            throw {
                message: "username and password required"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(200).json({
            success: false,
            ...ex
        });
    }
});

router.post("/getSavedBooks", passport.authenticate('jwt', { session: false }), async (req, res) => {

    try {
        console.log(req.body.user);
        let books = await userService.getSavedBooks(req.body.user.username);
        if (books.length > 0) {
            res.status(200).json({ books });
        } else {
            throw {
                message: "no books saved"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex)
    }

})

router.post("/login", passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        const result = userService.login(user);
        // const { _id } = req.user;
        // const token = signToken(_id);
        const token = result;
        res.cookie('access_token', result, { httpOnly: true, sameSite: true });
        res.status(200).json({ token: token, user: user });
    }
});

router.post("/logout", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ success: true });
});


router.post("/resetPassword", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let output = await userService.resetPassword(req.user, req.body.password);
        res.status(200).json(output);
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
});

module.exports = router;