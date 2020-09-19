const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = new mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin')



router.post("/signup", (req, res) => {
  //getting the name, email, password from the frontend (from req.body)
  const { name, email, password } = req.body;

  // if any of these is empty
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please fill out all the fields" });
  }
  //check if the email exist
  User.findOne({ email: email }) 
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User is Already exist with that email" });
      }
      //hashing the password of the user(12 characters)
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post ("/signin", (req, res) =>{
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(422).json({ error: "Please add email or password"});
  }
  User.findOne({ email: email}).then (saveduser =>{
    if(!saveduser){
      return res.status(422).json({ error: "Invalid email or password"})
    }
    //compare the password then get a boolean 
    bcrypt.compare(password, saveduser.password).then(doMatch => {
      if(doMatch){
        //if the email and password match, give the user a web token, will access the ID of the user
        const token = jwt.sign({ _id: saveduser._id}, JWT_SECRET)
        const { _id, name, email } = saveduser; //destructuring these data from the user
        res.json({ token: token, user: { _id, name, email}});
      }
      else {
        return res.status(442).json({ error: "Invalid email or password"});
      }
    }).catch(err => { //if error from the development side
      console.log(err);
    })
  }) 
})

module.exports = router;
