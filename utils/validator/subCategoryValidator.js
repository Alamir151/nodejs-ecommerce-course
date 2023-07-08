const { check,body } = require('express-validator');
const slugify=require('slugify');

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getsubCategoryValidator = [check("id").isMongoId().withMessage("Invalid subCategory id fomat"),

    validatorMiddleware
    ,];

exports.createsubCategoryValidator = [
    check("name").notEmpty().withMessage("subCategory required").isLength({ min: 2 }).
        withMessage("Too short subcategory  name...").isLength({ max: 32 }).
        withMessage("Too long subcategory name").custom((value,{req})=>{
            req.slug=slugify(value);
            return true;
        }),
    check('category').notEmpty().withMessage(`category id must be added`).isMongoId().withMessage("Invalid Category id fomat"),
    validatorMiddleware

];


exports.deletesubCategoryValidator = [check("id").isMongoId().withMessage("Invalid subCategory id fomat"),

    validatorMiddleware
    ,];
exports.updatesubCategoryValidator = [check("id").isMongoId().withMessage("Invalid subCategory id fomat"),
body("name").custom((value,{req})=>{
    req.body.slug=slugify(value);
    return true;
}),

    validatorMiddleware
    ,];
