const { JsonWebTokenError } = require("jsonwebtoken");

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const mongoose = require('mongoose');
const User = new mongoose.model("User");

module.exports = (req, res, next) =>{
    const { authorization } = req.headers;
    //authorization look like this => Bearer eyJhbGciOiJ
    if (!authorization){
        return res.status(401).json({ error: "you must be logged in"});
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if(err) {
            return res.status(401).json({ error: "you must be logged in"});
        }
        const { _id } = payload;
        User.findById(_id).then(userdata => {
            req.user = userdata;
            next();
        })
    })
}