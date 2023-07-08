const { check, body } = require('express-validator');
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require('slugify');
const Review = require("../../models/reviewModel");
const User = require('../../models/userModel');

exports.getReviewValidator = [check("id").isMongoId().withMessage("Invalid Review id fomat"),

    validatorMiddleware
    ,];

exports.createReviewValidator = [
    check("title").optional(),
    check("ratings").notEmpty().withMessage("review ratings required").isNumeric()
        .withMessage("Review ratings must be a number").isFloat({ min: 1, max: 5 }).withMessage("review ratings must be between 1 and 5"),
    check("user").isMongoId().withMessage("Invalid user id fomat"),
    check("product").isMongoId().withMessage("Invalid product id fomat").custom(async (val, { req }) => {
        //check if logged user create review before
        await Review.findOne({ user: req.user._id, product: req.body.product }).then(review => {
            if (review) {
                return Promise.reject(new Error("You already created review before"));
            }
        });
        return true;


    }),

    validatorMiddleware

];


exports.deleteReviewValidator = [check("id").isMongoId().withMessage("Invalid Review id fomat").custom(async (val, { req }) => {
    //check review ownership beofre update 
    const review = await Review.findById(val);
    if (req.user.role === "user") {
        if (!review) {
            return Promise.reject(new Error(`ther is no review with this id ${val}`));
        }
        const user = await User.findById(req.user._id);
        if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(new Error(`You are not allowed to delete this review`));

        }
    }
    return true;


}),



    validatorMiddleware
    ,];
exports.updateReviewValidator = [
    check("id").isMongoId().withMessage("Invalid Review id fomat").custom(async (val, { req }) => {
        //check review ownership beofre update 
        const review = await Review.findById(val);
        if (!review) {
            return Promise.reject(new Error(`ther is no review with this id ${val}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(new Error(`You are not allowed to update this review`));

        }
        return true;

    }),

    validatorMiddleware
    ,];
