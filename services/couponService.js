

const couponModel = require('../models/couponModel');


const factory=require('./handlersFactory');



//@desc Get List  of all coupons 
//@route GET /api/v1/coupons
//@access private/Admin-Manager 
exports.getCoupons =factory.getAll(couponModel);


//Get specific coupon 
//@route Get /api/v1/coupon/:id
//@access private/Admin-Manager
exports.getCoupon=factory.getOne(couponModel);

//@desc create new coupon 
//@route POST /api/v1/coupons
//@access private/Admin-Manager 
exports.createCoupon = factory.createOne(couponModel);
//@desc update specific coupon 
//@route PUT /api/v1/coupons/:id
//@access private/Admin-Manager 
exports.updateCoupon = factory.updateOne(couponModel);

//@desc  Delete specific coupon 
//@route DELETE /api/v1/coupons/:id
//@access private/Admin-Manager 

exports.deleteCoupon=factory.deleteOne(couponModel);