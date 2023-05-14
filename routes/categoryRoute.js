

const express = require('express');
const { getCategoryValidator,
    createCategoryValidator, updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validator/categoryValidator');


const { getCategories,
    getCategory
    , createCategory,
    updateCategory,
    deleteCategory
} = require('../services/categoryService');
const subcategoriesRouter=require('./subCategoryRoute');

const router = express.Router();
router.use('/:categoryId/subcategories',subcategoriesRouter);

router.route("/").get(getCategories).post(createCategoryValidator, createCategory);
router.route("/:id").get(getCategoryValidator,
    getCategory
).
    put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;