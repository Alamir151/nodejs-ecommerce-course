const { check,body } = require('express-validator');

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require('slugify');
const User = require("../../models/userModel");
const ApiError = require('../apiError');



exports.signupValidator = [
    check("name").notEmpty().withMessage("User required").isLength({ min: 3 }).
        withMessage("Too short User  name...").isLength({ max: 32 }).
        withMessage("Too long User name").custom((value, { req }) => {
            req.slug = slugify(value);
            return true;
        }),
    check("email").notEmpty().withMessage("Email Required").isEmail().
        withMessage("Please enter a valid email address").custom(async (value) => {
            await User.findOne({ email: value }).then((user) => {
                if (user) throw new ApiError("E-mail already in use")
            });

            return true;



        }),
   
    check("password").notEmpty().withMessage("Password required")
        .isLength({ min: 6 }).withMessage("Password must be greater than or equal to 6 characters").custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new ApiError("password Confirmation incorrect");
            }
            return true;
        }),
    check("passwordConfirm").notEmpty().withMessage("password confirmation required"),
   

    validatorMiddleware

];

exports.loginValidator = [
   
    check("email").notEmpty().withMessage("Email Required").isEmail().
        withMessage("Please enter a valid email address"),
   
    check("password").notEmpty().withMessage("Password required")
        .isLength({ min: 6 }).withMessage("Password must be greater than or equal to 6 characters"),

   

    validatorMiddleware

];



