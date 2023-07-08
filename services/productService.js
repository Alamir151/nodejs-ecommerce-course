const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const AsyncHandler = require("express-async-handler");

const factory = require('./handlersFactory');
const productModel = require('../models/productModel');

const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");


exports.uploadProductImages = uploadMixOfImages([{
    name: "imageCover", maxCount: 1
}, {
    name: "images", maxCount: 4

}]);

exports.resizeProductImages = AsyncHandler(async (req, res, next) => {
    //1-image processing fo image cover
    if (req.files.imageCover) {
        const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover`;
        await sharp(req.files.imageCover[0].buffer).resize(2000, 1330).toFormat("jpeg")
            .jpeg({ quality: 90 }).toFile(`uploads/products/${imageCoverFilename}.jpeg`);
        req.body.imageCover = `${imageCoverFilename}.jpeg`;
    }
    //2-image processing for images 
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (image, index) => {
                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(image.buffer).resize(2000, 1330).toFormat("jpeg")
                    .jpeg({ quality: 90 }).toFile(`uploads/products/${imageName}.jpeg`);

                req.body.images.push(imageName);
            })
        );
    }
    next();



});

//@desc Get List  of all products 
//@route GET /api/v1/products
//@access public 
exports.getproducts = factory.getAll(productModel, "Products");
//Get specific product 
//@route Get /api/v1/products/:id
//@access Public
exports.getproduct = factory.getOne(productModel, { path: "reviews", select: "product" });

//@desc create new product 
//@route POST /api/v1/products
//@access private 
exports.createproduct = factory.createOne(productModel);
//@desc update specififc product 
//@route PUT /api/v1/products/:id
//@access private 
exports.updateproduct = factory.updateOne(productModel);

//@desc  Delete specififc product 
//@route DELETE /api/v1/products/:id
//@access private 
exports.deleteproduct = factory.deleteOne(productModel);


