const AsyncHandler=require('express-async-handler');

const ReviewModel = require('../models/reviewModel');



const factory=require('./handlersFactory');


exports.setCProductIdAndUserIdToBody=(req,res,next) => {
    if(!req.body.product) req.body.product =req.params.productId;
    if(!req.body.user) req.body.user =req.user._id;
    next();
}
//@desc Get List  of all Reviews 
//@route GET /api/v1/reviews
//@access public 
exports.getReviews =factory.getAll(ReviewModel);


//Get specific Review 
//@route Get /api/v1/reviews/:id
//@access Public
exports.getReview=factory.getOne(ReviewModel);

//@desc create new Review 
//@route POST /api/v1/reviews
//@access private 
exports.createReview = factory.createOne(ReviewModel);
//@desc update specififc Review 
//@route PUT /api/v1/reviews/:id
//@access private /protect
exports.updateReview = factory.updateOne(ReviewModel);
exports.createFilterObj=(req,res,next)=>{
    let filterObject = {};
    if (req.params.productId) {
        
        filterObject = { product: req.params.productId };
    }
    req.filterObject=filterObject;
    next();
}
//@desc  Delete specififc Review 
//@route DELETE /api/v1/reviews/:id
//@access private/protect/user-admin-manager

exports.deleteReview=factory.deleteOne(ReviewModel);


