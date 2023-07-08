const express = require('express');
const { getCategoryValidator,
    createCategoryValidator, updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validator/categoryValidator');



const { getCategories,
    getCategory
    , createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage
} = require('../services/categoryService');
const subcategoriesRouter = require('./subCategoryRoute');
const authServices=require("../services/authService");

const router = express.Router();
router.use('/:categoryId/subcategories', subcategoriesRouter);

router.route("/").get(getCategories).post(authServices.auth,
    authServices.allowedTo("admin","manager")
    ,
   uploadCategoryImage,
   resizeImage,
    createCategoryValidator, createCategory);
router.route("/:id").get(getCategoryValidator,
    getCategory
).
    put(authServices.auth,
        authServices.allowedTo("admin","manager"), uploadCategoryImage,
        resizeImage,updateCategoryValidator, updateCategory)
    .delete(authServices.auth,
        authServices.allowedTo("admin"),deleteCategoryValidator, deleteCategory);

module.exports = router;
