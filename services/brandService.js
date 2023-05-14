

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const ApiError = require('../utils/apiError');
const brandModel = require('../models/brandModel');

//@desc Get List  of all Brands 
//@route GET /api/v1/Brands
//@access public 
exports.getBrands =asyncHandler(async (req, res) => {
  const page=req.query.page*1|| 1;
  const limit=req.query.limit*1||5;
  const skip=(page-1)*limit;
  const Brands=await brandModel.find({}).skip(skip).limit(limit);

  res.status(200).json({results:Brands.length,page,date:Brands})


})


//Get specific brand 
//@route Get /api/v1/Brands/:id
//@access Public
exports.getbrand=(asyncHandler(async(req,res,next)=>{
const {id}=req.params;
const brand = await brandModel.findById(id);
if(!brand){
  // res.status(404).json({error:`No brand Found for id ${id}`});
  return next(new ApiError(`No brand Found for id ${id}`,404));
  
}
res.status(200).json({data:brand});


}))

//@desc create new brand 
//@route POST /api/v1/Brands
//@access private 
exports.createbrand = asyncHandler(async (req, res) => {
  const {name} = req.body
  const brand = await brandModel.create({ name: name, slug: slugify(name) });

  res.status(201).json({ data: brand });

})
//@desc update specififc brand 
//@route PUT /api/v1/Brands/:id
//@access private 
exports.updatebrand = asyncHandler(async (req, res,next) => {
  const {id}=req.params
  const {name} = req.body;
  const brand = await brandModel.findOneAndUpdate({_id:id},{name,slug:slugify(name)},{new:true});
  if(!brand){
    return next(new ApiError(`No brand Found for id ${id}`,404));

  }

  res.status(201).json({ data: brand });

})

//@desc  Delete specififc brand 
//@route DELETE /api/v1/Brands/:id
//@access private 
exports.deletebrand = asyncHandler(async (req, res,next) => {
  const {id}=req.params
  
  const brand = await brandModel.findOneAndDelete({_id:id});
  if(!brand){
    return next(new ApiError(`No brand Found for id ${id}`,404));

  }

  res.status(204).send();

})

