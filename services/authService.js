
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");
const GenereateToken=require("../utils/GenerateToken");



//@desc Sign up
//@route POST /api/v1/auth/signup
//@access public 
exports.signUp = asyncHandler(async (req, res, next) => {
    //1-create User account
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,

        password: req.body.password
    });
    //2-Genereate Token
    const token = GenereateToken({ userId: user._id });
    res.status(201).json({ data: user, token });
});
//@desc Login
//@route POST /api/v1/auth/login
//@access public 
exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);

    if (!user || !(await (bcrypt.compare(req.body.password, user.password)))) {
        return next(new ApiError("Incorrect email or password", 401))
    } else {
        console.log("error")
    }
    const token = GenereateToken({ userId: user._id });
    res.status(201).json({ data: user, token });


});
//@desc check if the user is authenticated
exports.auth = asyncHandler(async (req, res, next) => {
    //1-check if token exist or not 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

    }
    if (!token) {
        return next(new ApiError("you are not login ", 401));
    }

    //2-verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //3-check if user exist 
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError("the user belonges to this token is does not longer exixts"))
    }
    //4-check if user change his password after token generated
    if (currentUser.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        //password changed
        if (passwordChangedTimestamp > decoded.iat) {
            return next(new ApiError("User changed his password, login again", 401));

        }
    }

    req.user = currentUser;
    next();

})
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    //1)-access role
    //2)-acces registered user
    if (!roles.includes(req.user.role)) {
        return next(new ApiError("you are not allowed to access this route", 403));
    }
    next();


}

);

//@desc Forgot Password
//@route POST /api/v1/auth/forgotPassword
//@access public 
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //1)- Get user by email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ApiError(`there is no user for this email ${req.body.email}`, 404));
    }
    //2)- if user exists generate 6 hash digits then save them in db 
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedresetPassword = crypto.createHash('sha256').update(resetCode).digest('hex');
    //save hashed password reset code in db
    user.passwordResetCode = hashedresetPassword;
    //save reset code expiration time(10min)
    user.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    user.passwordResetVerfied = false;
    await user.save();
    //3)-send the reset code via email
    try {
        await sendEmail({ email: user.email,
             subject: "Your password reset code", message: `Your reset password ${resetCode}` });

    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires=undefined;
        user.passwordResetVerfied = undefined;
        await user.save();
        return next(new ApiError(`there is an error occured `,500));
    }
    res.status(200).json({ success: true, message: `reset password message sent successfully` });


});

//@desc Verify reset code
//@route POST /api/v1/auth/verifyResetCode
//@access public 
exports.verifyPasswordResetCode=asyncHandler(async(req,res,next)=>{
    //1)-Get user based on reset code
    const hashedresetPassword = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
    const user=await User.findOne({passwordResetCode:hashedresetPassword,passwordResetExpires:{$gt:Date.now()}});
    if(!user){
        return next(new ApiError(`reset password code invalid or expired`));
    }
    //2)- reset code valid 
    user.passwordResetVerfied=true,
    await user.save();
    res.status(200).json({status: 'success'});
})

//@desc Reset Password
//@route POST /api/v1/auth/resetPassword
//@access public 
exports.resetPassword=asyncHandler(async(req,res,next)=>{
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ApiError(`there is no user for this email ${req.body.email}`, 404));
    }
    if(!user.passwordResetVerfied) {
        return next(new ApiError("reset password code not verified",400));
    }
    user.password=req.body.password;
    user.passwordResetCode=undefined;
    user.passwordResetVerfied=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    //if everything is ok then generate token
    const token=GenereateToken({userId:user._id});
    res.status(200).json({token})
})