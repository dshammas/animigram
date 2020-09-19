const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
;
const postSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    body: {
        type:String,
        required:true
    },
    photo: {
        type:String,
        default:"no photo"
    },
    postedBy: {
        type:ObjectId, //this is referring to the id of the user
        ref: "User"    //this is referring to the User model 
    },
})

mongoose.model("Post", postSchema);


