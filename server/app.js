const express = require('express');
var cors = require('cors')
const app = express();
const mongoose = require('mongoose'); //for communication with mongoDB
const PORT = 5000;
const {MONGOURL} = require('./keys');


app.use(cors())

//connecting to the DB, NOTE: I added these two dep. to get rid of a warring I had
mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () =>{
    console.log("connected to mongo")
})

mongoose.connection.on('error', () =>{
    console.log("error connecting", err)
})

require('./models/user');
require('./models/post');
//this will form the data into json. it has to be before the auth require 
app.use(express.json());
//this is how to register the routs
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.listen(PORT, ()=>{
    console.log("server is running on", PORT);
})