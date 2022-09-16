require('dotenv').config()
const jwt = require('jsonwebtoken');
const register = require('../model/register');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token,process.env.CLINT_SECRET);
        const user = await register.findOne({_id:verify._id})
        console.log(user.email)
        
         req.token = token;
         req.user = user;
         
        } catch (error) {
            req.status = 500;
        }
        next();
    
    
}

module.exports = auth;