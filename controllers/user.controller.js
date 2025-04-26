let { validationResult } = require('express-validator');
let {v4:uuid} = require('uuid');
let bcrypt = require('bcryptjs');         
const jwt = require('jsonwebtoken');                                                                                              
const userModel = require('../db/models/user');

// let users = [
//     {
//         id: uuid(),
//         name:"Kuro",
//         email:"kuro@gmail.com",
//         password:"1234@kuro",
//         phone:"9457545565"
//     },
//     {
//         id: uuid(),
//         name:"Sunny",
//         email:"sunny@gmail.com",
//         password:"1234@sunny",
//         phone:"0000000000"
//     }
// ]

let signinUser = async (req, res) => {
    let errors = validationResult(req);
    let body = req.body;

    if(!errors.isEmpty()){
        return res.status(400).json({success:false,message:errors.array()[0].msg});
    }

    query = {
        email: body.email
    }
    let user = await userModel.findOne(query);
    if(!user){
        return res.status(404).json({success:false,message: "User not found"});
    }

    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if(!isPasswordMatch){
        return res.status(401).json({success:false,message: "Invalid password"});
    }

    const payload = {
        userId: user.id,

    }
    const tokenSecret = process.env.TOKEN_SECRET;
    jwt.sign(payload, tokenSecret, {expiresIn: "1h"},
        (err,token)=>{
            if(err){
                return res.status(500).json({success:false,message: "Error in token generation"});
            }
            res.header("x-access-token", token);
            res.status(200).json({success:true,message: "Signin successful", token:token});
        });
    
}

let signupUser = async (req, res) => {
    let errors = validationResult(req);
    let body = req.body;

    if(!errors.isEmpty()){
        return res.status(400).json({success:false,message:errors.array()[0].msg});
    }

    let existingUser =  await userModel.findOne({ email: body.email });
    if(existingUser){
        return res.status(409).json({success:false,message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);

    let hashedPassword = await bcrypt.hash(body.password, salt);
    let newUser = new userModel({
        id: uuid(),
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone
    });
    await newUser.save();
    res.status(201).json({success:true,message: "Signup successful",data:newUser});
}

let updateUser = async (req, res) => {
    try{
        let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,message:errors.array()[0].message});
    }

    let userId = req.params.id;

    let updatedUser = await users.findByIdAndUpdate(userId, req.body, { new: true });

    if(!updatedUser){
        return res.status(404).json({success:false,message:"User Not Found"})

    }
    res.status(200).json({success:true,message:"User Updated Successfully"});
    }
    catch(err){
        res.status(400).json({success:false,message:err.message});
    }
    
}


let deleteUser = async (req, res) => {
    try{
        let userId = req.params.id;
        let deletedUser = await userModel.findByIdAndDelete(userId);

        if(!deletedUser){
            return res.status(404).json({success:false,message:"User Not Found"});
        }
        res.status(200).json({success:true,message:"User Deleted Successfully"});
    }
    catch(err){
        res.status(400).json({success:false,message:err.message});
    }
    
}
module.exports = {
    signinUser,
    signupUser,
    updateUser,
    deleteUser
}