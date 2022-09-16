//regestration schame;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

var reg = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,

    },
    cpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})

reg.methods.registerToken = function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.CLINT_SECRET)
        this.tokens = this.tokens.concat({ token: token })

        console.log(token);
        return token;

    } catch (error) {
        console.log(error);
    }
}
reg.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10)
        this.cpassword = await bcrypt.hash(this.cpassword,10)
         
    }
    next();
})

const register = mongoose.model('Register', reg);
module.exports = register;