

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const productModel = require('../models/productModel');
const ApiError = require('../utils/apiError');

//@desc Get List  of all products 
//@route GET /api/v1/products
//@access public 
exports.getproducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await productModel.find({}).skip(skip).limit(limit).populate({ path: 'category', select: 'name-_id' });

  res.status(200).json({ results: products.length, page, date: products })


})


//Get specific product 
//@route Get /api/v1/products/:id
//@access Public
exports.getproduct = (asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id).populate({ path: 'category', select: 'name-_id' });
  if (!product) {
    // res.status(404).json({error:`No product Found for id ${id}`});
    return next(new ApiError(`No product Found for id ${id}`, 404));

  }
  res.status(200).json({ data: product });


}))

//@desc create new product 
//@route POST /api/v1/products
//@access private 
exports.createproduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);

  res.status(201).json({ data: product });

})
//@desc update specififc product 
//@route PUT /api/v1/products/:id
//@access private 
exports.updateproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await productModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
  if (!product) {
    return next(new ApiError(`No product Found for id ${id}`, 404));

  }

  res.status(201).json({ data: product });

})

//@desc  Delete specififc product 
//@route DELETE /api/v1/products/:id
//@access private 
exports.deleteproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const product = await productModel.findOneAndDelete({ _id: id });
  if (!product) {
    return next(new ApiError(`No product Found for id ${id}`, 404));

  }

  res.status(204).send();

})

