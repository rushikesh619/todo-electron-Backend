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
    try {
        if (req.body) {
            if (req.body.username && req.body.password) {
                const data = req.body;
                let result = await userService.createUser(data);
                {
                    result.message ? (res.status(200).json({ user: null, success: false, message: result.message })) :
                        (res.status(200).json({ user: result, success: true, message: "OK" }))
                }
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

router.post("/savetasks/:id", async (req, res) => {
    console.log(req.body)
    console.log(req.params.id)
    const tasks = req.body;
    const id = req.params.id;
    const output = await userService.savetasks(id, tasks);
    console.log(output);
    res.status(200).json({ success: output.success });
});

router.post("/login", passport.authenticate('local', { session: false }), (req, res) => {
    console.log(req.body)
    if (req.isAuthenticated()) {
        const user = req.user;
        const output = userService.login(user);
        // const { _id } = req.user;
        // const token = signToken(_id);
        res.cookie('access_token', output, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: req.user });
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