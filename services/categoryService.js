const { v4: uuidv4 } = require('uuid');
const factory = require('./handlersFactory');
const CategoryModel = require('../models/categoryModel');

const sharp = require('sharp');

const AsyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');




exports.resizeImage = AsyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}`;
    await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg")
    .jpeg({ quality: 90 }).toFile(`uploads/categories/${filename}.jpeg`);
    req.body.image=`${filename}.jpeg`;
    next();
});

exports.uploadCategoryImage = uploadSingleImage("image");

//@desc Get List  of all Categories 
//@route GET /api/v1/categories
//@access public 
exports.getCategories = factory.getAll(CategoryModel);


//Get specific category 
//@route Get /api/v1/categories/:id
//@access Public
exports.getCategory = factory.getOne(CategoryModel);

//@desc create new category 
//@route POST /api/v1/categories
//@access private 
exports.createCategory = factory.createOne(CategoryModel);
//@desc update specififc category 
//@route PUT /api/v1/categories/:id
//@access private 
exports.updateCategory = factory.updateOne(CategoryModel);

//@desc  Delete specififc category 
//@route DELETE /api/v1/categories/:id
//@access private 
exports.deleteCategory = factory.deleteOne(CategoryModel);


