const AsyncHandler=require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const brandModel = require('../models/brandModel');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const sharp = require('sharp');

const factory=require('./handlersFactory');

exports.resizeImage = AsyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}`;
    await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg")
    .jpeg({ quality: 90 }).toFile(`uploads/brands/${filename}.jpeg`);
    req.body.image=`${filename}.jpeg`;
    next();
});

exports.uploadBrandImage = uploadSingleImage("image");

//@desc Get List  of all Brands 
//@route GET /api/v1/Brands
//@access public 
exports.getBrands =factory.getAll(brandModel);


//Get specific brand 
//@route Get /api/v1/Brands/:id
//@access Public
exports.getbrand=factory.getOne(brandModel);

//@desc create new brand 
//@route POST /api/v1/Brands
//@access private 
exports.createbrand = factory.createOne(brandModel);
//@desc update specififc brand 
//@route PUT /api/v1/Brands/:id
//@access private 
exports.updatebrand = factory.updateOne(brandModel);

//@desc  Delete specififc brand 
//@route DELETE /api/v1/Brands/:id
//@access private 

exports.deletebrand=factory.deleteOne(brandModel);


