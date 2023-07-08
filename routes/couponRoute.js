

const express = require('express');
const { getBrandValidator,
    createBrandValidator, updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validator/brandValidator');


const { getCoupons,
    getCoupon,
    createCoupon,
    
    updateCoupon,
    deleteCoupon,
   
} = require('../services/couponService');
const authServices=require("../services/authService");


const router = express.Router();
router.use(authServices.auth,authServices.allowedTo("admin","manager"))

router.route("/").get( getCoupons).post(
     createCoupon);
router.route("/:id").get(
    getCoupon
).
    put( updateCoupon)
    .delete(deleteCoupon);

module.exports = router;
