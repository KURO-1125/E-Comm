const e = require('express');
const mongoose = require('mongoose');


let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }

})

const userModel = mongoose.model('User',userSchema);
module.exports = userModel;