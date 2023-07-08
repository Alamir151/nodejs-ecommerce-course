const { check,body } = require('express-validator');
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require('slugify');

exports.getBrandValidator = [check("id").isMongoId().withMessage("Invalid Brand id fomat"),

    validatorMiddleware
    ,];

exports.createBrandValidator = [
    check("name").notEmpty().withMessage("Brand required").isLength({ min: 3 }).
        withMessage("Too short Brand  name...").isLength({ max: 32 }).
        withMessage("Too long Brand name").custom((value,{req})=>{
            req.slug=slugify(value);
            return true;
        }),
    validatorMiddleware

];


exports.deleteBrandValidator = [check("id").isMongoId().withMessage("Invalid Brand id fomat"),


    validatorMiddleware
    ,];
exports.updateBrandValidator = [check("id").isMongoId().withMessage("Invalid Brand id fomat"),
body("name").optional().custom((value,{req})=>{
    req.body.slug=slugify(value);
    return true;
}),

    validatorMiddleware
    ,];
