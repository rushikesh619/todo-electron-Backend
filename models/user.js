const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const user = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 6,
            max: 15
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        todos: [
            String,
        ]
    },
)

user.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err) {
            return next(err);
        }
        this.password = passwordHash;
        next();
    });
});

user.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        } else {
            if (!isMatch) {
                return cb(null, isMatch);
            }
            return cb(null, this);
        }
    })
}

const User = mongoose.model("User", user);
module.exports = User;