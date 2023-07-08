

const express = require('express');
const { getBrandValidator,
    createBrandValidator, updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validator/brandValidator');


const {
    addProductToWishList,
    removeProductFromWishList,
    getLoggedUserWishList
} = require('../services/wisgListService');
const authServices = require("../services/authService");


const router = express.Router();


router.route("/").get(authServices.auth, authServices.allowedTo("user"), getLoggedUserWishList).
post(authServices.auth, authServices.allowedTo("user"),
    addProductToWishList).delete(authServices.auth, authServices.allowedTo("user"), removeProductFromWishList);

router.route("/:productId").delete(authServices.auth,
    authServices.allowedTo("user"), removeProductFromWishList);
module.exports = router;
