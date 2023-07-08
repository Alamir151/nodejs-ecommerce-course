const { check, body } = require('express-validator');
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require('slugify');

exports.getCategoryValidator = [check("id").isMongoId().withMessage("Invalid Category id fomat"),

    validatorMiddleware
    ,];

exports.createCategoryValidator = [
    check("name").notEmpty().withMessage("Category required").isLength({ min: 3 }).
        withMessage("Too short category  name...").isLength({ max: 32 }).
        withMessage("Too long category name").custom((value, { req }) => {
            req.slug = slugify(value);
            return true;
        }),
    validatorMiddleware

];


exports.deleteCategoryValidator = [check("id").isMongoId().withMessage("Invalid Category id fomat"),

    validatorMiddleware
    ,];
exports.updateCategoryValidator = [check("id").isMongoId().withMessage("Invalid Category id fomat"),
body("name").optional().custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
}),
    validatorMiddleware
    ,];
