

const express = require('express');

const {
    createReviewValidator,
    updateReviewValidator,
    getReviewValidator,
    deleteReviewValidator
}=require("../utils/validator/reviewValidator");

const { getReviews,
    getReview
    , createReview,
    updateReview,
    deleteReview,
    createFilterObj,
    setCProductIdAndUserIdToBody
} = require('../services/reviewService');
const authServices=require("../services/authService");


const router = express.Router({ mergeParams: true });


router.route("/").get(createFilterObj,getReviews).post(authServices.auth,
    authServices.allowedTo("user"),
    setCProductIdAndUserIdToBody,
    createReviewValidator,
    createReview);
router.route("/:id").get(
    getReviewValidator,
    getReview
).
    put(authServices.auth,
        authServices.allowedTo("user"),updateReviewValidator, updateReview)
    .delete(authServices.auth,
        authServices.allowedTo("admin","manager","user"),deleteReviewValidator, deleteReview);

module.exports = router;
