const User = require("../models/user");
const bcrypt = require("bcrypt-nodejs");
const passport = require('passport');
const JWT = require("jsonwebtoken");
const config = require("../config");

const signToken = userID => {
    return JWT.sign({
        iss: "booksouls",
        sub: userID,
    }, config.secret, { expiresIn: "1 day" });
}

const createUser = async (doc) => {
    try {
        let {
            username, firstName, lastName, password
        } = doc;
        if (!username || !firstName || !lastName || !password) {
            return {
                err: true,
                message: "Missing required fields",
            };
        }
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return {
                err: true,
                message: "User already exists.",
            };
        }
        let user = new User({
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password,
        });
        user = await user.save();
        return user;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const login = async (user) => {

    const { _id } = user;
    const token = signToken(_id);
    return token;
    // res.cookie('access_token', token, { httpOnly: true, sameSite: true });
    // res.status(200).json({ isAuthenticated: true, user: req.user });
}

const resetPassword = async (user, password) => {
    try {
        let userObj = await User.findById(user._id);
        if (userObj) {
            userObj.password = password;
            userObj.forceChangePassword = false;
            userObj = await userObj.save();
            userObj.password = null;
            return { user: userObj, message: "Password updated successfully!" };
        }
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}



module.exports = {
    createUser, login, resetPassword
}
