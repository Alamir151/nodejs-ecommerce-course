

const express = require('express');
// const { getBrandValidator,
//     createBrandValidator, updateBrandValidator,
//     deleteBrandValidator
// } = require('../utils/validator/brandValidator');


const { addProductToCart,getLoggedUserCart,
    removeCartItem,updateCartItemQuantity,
    clearCart,
    applyCoupon
} = require('../services/cartService');
const authServices=require("../services/authService");


const router = express.Router();


router.route("/").get(authServices.auth,
    authServices.allowedTo("user"),getLoggedUserCart).post(authServices.auth,
    authServices.allowedTo("user"),addProductToCart).delete(authServices.auth,
        authServices.allowedTo("user"),clearCart);


router.route("/applyCoupon").put(authServices.auth,
            authServices.allowedTo("user"),applyCoupon);

router.route("/:itemId").put(authServices.auth,
    authServices.allowedTo("user"),updateCartItemQuantity).delete(authServices.auth,
    authServices.allowedTo("user"),removeCartItem);




module.exports = router;
