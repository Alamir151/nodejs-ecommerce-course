const { check, body } = require('express-validator');
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require('slugify');
const User = require("../../models/userModel");
const ApiError = require('../apiError');

exports.getUserValidator = [check("id").isMongoId().withMessage("Invalid User id fomat"),

    validatorMiddleware
    ,];

exports.createUserValidator = [
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
    check("active").optional().isBoolean().withMessage("Active must be true or false"),
    check("phone").optional().isMobilePhone("ar-EG").withMessage("it accept egyptian numbers"),
    check("password").notEmpty().withMessage("Password required")
        .isLength({ min: 6 }).withMessage("Password must be greater than or equal to 6 characters").custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new ApiError("password Confirmation incorrect");
            }
            return true;
        }),
    check("passwordConfirm").notEmpty().withMessage("password confirmation required"),
    check("profileImage").optional(),
    check("role").optional(),

    validatorMiddleware

];


exports.deleteUserValidator = [check("id").isMongoId().withMessage("Invalid User id fomat"),


    validatorMiddleware
    ,];
exports.updateUserValidator = [check("id").isMongoId().withMessage("Invalid User id fomat"),
body("name").optional().custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
}),check("phone").optional().isMobilePhone("ar-EG").withMessage("it accept egyptian numbers"),

check("active").optional().isBoolean().withMessage("Active must be true or false"),
check("email").optional().notEmpty().withMessage("Email Required").isEmail().
        withMessage("Please enter a valid email address").custom(async (value) => {
            await User.findOne({ email: value }).then((user) => {
                if (user) throw new ApiError("E-mail already in use")
            });

            return true;

}),
check("profileImage").optional(),
check("role").optional(),


    validatorMiddleware
    ,];

exports.changePasswordValidator = [
    check("id").isMongoId().withMessage("Invalid User id fomat"),
    body("currentPassword").notEmpty().withMessage("Current password must not be empty"),
    body("passwordConfirm").notEmpty().withMessage("Password conifrmation required"),
    body("password").notEmpty().withMessage("Password required").custom(async (value, { req }) => {
        //1-verify current User
        let user = await User.findById(req.params.id);
        if (!user) {
            throw new ApiError(`there is no user for id ${req.params.id}`, 404);
        }
        const result=await bcrypt.compare(req.body.currentPassword, user.password);
        if(!result) {
            throw new ApiError(`InCorrect password`);
        }
 

        //2-verify confirm password
        if (value !== req.body.passwordConfirm) {
            throw new ApiError("Password confirmation inCorrect");
        }
        return true;
    })
    ,
    validatorMiddleware
]
exports.updateLoggedUserValidator = [
body("name").optional().custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
}),check("phone").optional().isMobilePhone("ar-EG").withMessage("it accept egyptian numbers"),

check("active").optional().isBoolean().withMessage("Active must be true or false"),
check("email").optional().notEmpty().withMessage("Email Required").isEmail().
        withMessage("Please enter a valid email address").custom(async (value) => {
            await User.findOne({ email: value }).then((user) => {
                if (user) throw new ApiError("E-mail already in use")
            });

            return true;

}),
check("profileImage").optional(),



    validatorMiddleware
    ,];
