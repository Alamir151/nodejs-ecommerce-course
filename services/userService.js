const AsyncHandler=require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const bcrypt=require("bcrypt");
const UserModel = require('../models/userModel');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const sharp = require('sharp');
const asyncHandler=require("express-async-handler");
const factory=require('./handlersFactory');
const ApiError=require("../utils/apiError");
const GenereateToken=require("../utils/GenerateToken");
const User = require('../models/userModel');


exports.resizeImage = AsyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}`;
    if(req.file){
    await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg")
    .jpeg({ quality: 90 }).toFile(`uploads/users/${filename}.jpeg`);
    req.body.image=`${filename}.jpeg`;
    }
    next();
});

exports.uploadUserImage = uploadSingleImage("profileImage");

//@desc Get List  of all users 
//@route GET /api/v1/users
//@access private 
exports.getUsers =factory.getAll(UserModel);


//Get specific user 
//@route Get /api/v1/users/:id
//@access private
exports.getUser=factory.getOne(UserModel);

//@desc create new user 
//@route POST /api/v1/users
//@access private 
exports.createUser = factory.createOne(UserModel);
//@desc update specififc user 
//@route PUT /api/v1/users/:id
//@access private 
exports.updateUser =asyncHandler(async (req, res, next) => {
    if(req.body.password){
        delete req.body.password;
    }
    console.log(req.body);

    const document = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) {
      return next(new ApiError(`No document Found for id ${req.params.id}`, 404));
  
    }
  
    res.status(200).json({ data: document });
  
  });
  exports.changeUserPassword=asyncHandler(async (req, res, next) => {
    const UserPassword=await bcrypt.hash(req.body.password,12)

    const document = await UserModel.findByIdAndUpdate(req.params.id, {
        password:UserPassword,passwordChangedAt:Date.now()
    
    }, { new: true });
    if (!document) {
      return next(new ApiError(`No document Found for id ${req.params.id}`, 404));
  
    }
  
    res.status(200).json({ data: document });
    next()
  
  });


//@desc  Delete specififc user 
//@route DELETE /api/v1/users/:id
//@access private 

exports.deleteUser=factory.deleteOne(UserModel);
//@desc Get logged user data 
//@route GET /api/v1/users/me 
//@access private/protect
exports.getLoggedUserData=asyncHandler(async(req,res,next)=>{
  req.params.id=req.user._id;
  next();
}); 
//@desc Update current user password 
//@route PUT /api/v1/users/updateMyPassword 
//@access private/protect
exports.updateloggedUserPassword=asyncHandler(async(req,res,next)=>{const UserPassword=await bcrypt.hash(req.body.password,12)

  const user = await UserModel.findByIdAndUpdate(req.user._id, {
      password:UserPassword,passwordChangedAt:Date.now()
  
  }, { new: true });
  const token=GenereateToken({userId:user._id});
  res.status(200).json({data:user,token});
  
});

//@desc Update current user data without password & role 
//@route PUT /api/v1/users/updateme
//@access private/protect
exports.updateLoggedUserData=asyncHandler(async(req,res,next)=>{
 
  const updatedUser=await UserModel.findByIdAndUpdate(req.user._id,{
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,

  },{new:true});
 
   res.status(200).json({data:updatedUser});
  
})

//@desc Deactivate user 
//@route DELET /api/v1/users/deleteMe
//@access private/protect
exports.deleteloggedUserData=asyncHandler(async(req, res, next)=>{

  await User.findByIdAndUpdate(req.user._id,{active:false});
  res.status(204).json({success:true});
  
})