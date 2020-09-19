const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

//create a route to get all the post in the DB
router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name") // the second parameter is to select only _id and
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

//create a rout for the post
router.post("/createpost", requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user.password = undefined; //password will not be stored with the user data inside post
  const post = new Post({
    title: title,
    body: body,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost",requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("PostedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost: mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
