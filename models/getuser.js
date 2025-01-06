// models/User.js
const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
 name:String,
 password:String
});

const user=mongoose.model("userstable",userSchema);

module.exports= user;