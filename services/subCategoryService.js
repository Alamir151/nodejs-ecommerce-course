
const subCategoryModel = require('../models/subCategoryModel');
const factory=require('./handlersFactory');

exports.setCategoryIdToBody=(req,res,next) => {
    if(!req.body.category) req.body.category =req.params.categoryId;
    next();
}

//@desc create new sub  category 
//@route POST /api/v1/subcategories
//@access private 
exports.createSubCategory = factory.createOne(subCategoryModel);
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
exports.getSubCategories = factory.getAll(subCategoryModel);


//Get specific subcategory 
//@route Get /api/v1/subcategories/:id
//@access Public
exports.getSubCategory = factory.getOne(subCategoryModel);


//@desc update specififc subCategory 
//@route PUT /api/v1/subcategories/:id
//@access private 
exports.updatesubCategory = factory.updateOne(subCategoryModel);

//@desc  Delete specififc SubCategory 
//@route DELETE /api/v1/subcategories/:id
//@access private 
exports.deleteSubCategory=factory.deleteOne(subCategoryModel)

