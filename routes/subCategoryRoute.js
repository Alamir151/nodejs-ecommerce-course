const express =require('express');

const router = express.Router({mergeParams:true});
const {
    createSubCategory,getSubCategory,
    getSubCategories,
    updatesubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj

} = require('../services/subCategoryService');

const {createsubCategoryValidator,getsubCategoryValidator, updatesubCategoryValidator}=require('../utils/validator/subCategoryValidator');
const { deleteCategoryValidator } = require('../utils/validator/categoryValidator');



router.route("/").post(setCategoryIdToBody,createsubCategoryValidator,createSubCategory)
.get(createFilterObj,getSubCategories);
router.route("/:id").get(getsubCategoryValidator,getSubCategory).delete(deleteCategoryValidator,deleteSubCategory).put(updatesubCategoryValidator,updatesubCategory);

module.exports=router;
