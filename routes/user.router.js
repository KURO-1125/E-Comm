const express = require("express");
const bodyParser = require("body-parser");
const {signinUser,signupUser,updateUser,deleteUser} = require("../controllers/user.controller");
const {check} = require("express-validator");
const auth = require("../middleware/auth");

let userRouter = express.Router();


userRouter.post("/signin",[
    check('email').notEmpty().normalizeEmail(),
    check('password').notEmpty()
],signinUser)

userRouter.post("/signup",[
    check('email').notEmpty().normalizeEmail(),
    check('password').notEmpty().isStrongPassword(),
    check('name').notEmpty().isLength({min:3}),
    check('phone').notEmpty().isMobilePhone("any")
],signupUser)

userRouter.patch("/:id",[
    check('name').notEmpty().isLength({min:3}),
    check('phone').notEmpty().isMobilePhone("any")
],updateUser)

userRouter.delete("/:id",deleteUser)

module.exports = userRouter;