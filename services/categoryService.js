

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const ApiError = require('../utils/apiError');

//@desc Get List  of all Categories 
//@route GET /api/v1/categories
//@access public 
exports.getCategories =asyncHandler(async (req, res) => {
  const page=req.query.page*1|| 1;
  const limit=req.query.limit*1||5;
  const skip=(page-1)*limit;
  const categories=await Category.find({}).skip(skip).limit(limit);

  res.status(200).json({results:categories.length,page,date:categories})


})


//Get specific category 
//@route Get /api/v1/categories/:id
//@access Public
exports.getCategory=(asyncHandler(async(req,res,next)=>{
const {id}=req.params;
const category = await Category.findById(id);
if(!category){
  // res.status(404).json({error:`No Category Found for id ${id}`});
  return next(new ApiError(`No Category Found for id ${id}`,404));
  
}
res.status(200).json({data:category});


}))

//@desc create new category 
//@route POST /api/v1/categories
//@access private 
exports.createCategory = asyncHandler(async (req, res) => {
  const {name} = req.body
  const category = await Category.create({ name: name, slug: slugify(name) });

  res.status(201).json({ data: category });

})
//@desc update specififc category 
//@route PUT /api/v1/categories/:id
//@access private 
exports.updateCategory = asyncHandler(async (req, res,next) => {
  const {id}=req.params
  const {name} = req.body;
  const category = await Category.findOneAndUpdate({_id:id},{name,slug:slugify(name)},{new:true});
  if(!category){
    return next(new ApiError(`No Category Found for id ${id}`,404));

  }

  res.status(201).json({ data: category });

})

//@desc  Delete specififc category 
//@route DELETE /api/v1/categories/:id
//@access private 
exports.deleteCategory = asyncHandler(async (req, res,next) => {
  const {id}=req.params
  
  const category = await Category.findOneAndDelete({_id:id});
  if(!category){
    return next(new ApiError(`No Category Found for id ${id}`,404));

  }

  res.status(204).send();

})

