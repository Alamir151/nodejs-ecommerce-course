const slugify = require('slugify');


const asyncHandler = require('express-async-handler');

const SubCategory = require('../models/subCategoryModel');
const ApiError = require('../utils/apiError');
const subCategoryModel = require('../models/subCategoryModel');

exports. setCategoryIdToBody=(req,res,next) => {
    if(!req.body.category) req.body.category =req.params.categoryId;
    next();
}

//@desc create new sub  category 
//@route POST /api/v1/subcategories
//@access private 
exports.createSubCategory = asyncHandler(async (req, res) => {
  
    const { name, category } = req.body
    const subcategory = await SubCategory.create({ name: name, slug: slugify(name), category });

    res.status(201).json({ data: subcategory });

})
exports.createFilterObj=(req,res,next)=>{
    let filterObject = {};
    if (req.params.categoryId) {
        console.log(req.params.categoryId);
        filterObject = { category: req.params.categoryId };
    }
    req.filterObject=filterObject;
    next();
}

//@desc Get List  of all subCategories 
//@route GET /api/v1/subCategories
//@access public 
exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    console.log(req.params);
 
   
   
    const subCategories = await subCategoryModel.find(req.filterObject)//.skip(skip);//.limit(limit).populate({ path: "category", });

    res.status(200).json({ results: subCategories.length, page, date: subCategories });
    // select: "name -_id"

});


//Get specific subcategory 
//@route Get /api/v1/subcategories/:id
//@access Public
exports.getSubCategory = (asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id).populate({ path: "category", select: "name -_id" });
    if (!subCategory) {
        // res.status(404).json({error:`No Category Found for id ${id}`});
        return next(new ApiError(`No subCategory Found for id ${id}`, 404));

    }
    res.status(200).json({ data: subCategory });


}))


//@desc update specififc subCategory 
//@route PUT /api/v1/subcategories/:id
//@access private 
exports.updatesubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, category } = req.body;
    const subCategory = await subCategoryModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name), category }, { new: true });
    if (!subCategory) {
        return next(new ApiError(`No Category Found for id ${id}`, 404));

    }

    res.status(201).json({ data: subCategory });

})

//@desc  Delete specififc SubCategory 
//@route DELETE /api/v1/subcategories/:id
//@access private 
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const subCategory = await subCategoryModel.findOneAndDelete({ _id: id });
    if (!subCategory) {
        return next(new ApiError(`No SubCategory Found for id ${id}`, 404));

    }

    res.status(204).send();

})
