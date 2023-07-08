const express = require('express');

const router = express.Router({ mergeParams: true });
const {
    createSubCategory, getSubCategory,
    getSubCategories,
    updatesubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj

} = require('../services/subCategoryService');
const authServices = require("../services/authService");
const { createsubCategoryValidator, getsubCategoryValidator, updatesubCategoryValidator } =
 require('../utils/validator/subCategoryValidator');
const { deleteCategoryValidator } = require('../utils/validator/categoryValidator');



router.route("/").post(authServices.auth,
    authServices.allowedTo("admin", "manager"), setCategoryIdToBody,
     createsubCategoryValidator, createSubCategory)
    .get(createFilterObj, getSubCategories);
router.route("/:id").get(getsubCategoryValidator, getSubCategory)
.delete(authServices.auth,
    authServices.allowedTo("admin"), deleteCategoryValidator, deleteSubCategory)
    .put(authServices.auth,
        authServices.allowedTo("admin", "manager"), updatesubCategoryValidator, updatesubCategory);

module.exports = router;
