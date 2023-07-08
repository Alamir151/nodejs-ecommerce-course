

const express = require('express');
const { getProductValidator,
    createProductValidator, updateProductValidator,
    deleteProductValidator
} = require('../utils/validator/productValidator');
const authServices=require("../services/authService");


const { 
    getproducts,
    getproduct
    , createproduct,
    updateproduct,
    deleteproduct,
    uploadProductImages,
    resizeProductImages
} = require('../services/productService');
const reviewsRoute=require("./reviewRoute");


const router = express.Router();
router.use('/:productId/reviews', reviewsRoute);

router.route("/").get(getproducts).post(authServices.auth,
    authServices.allowedTo("admin","manager"),uploadProductImages,
    resizeProductImages,createProductValidator, createproduct);
router.route("/:id").get(getProductValidator,
    getproduct
).
    put(authServices.auth,
        authServices.allowedTo("admin","manager"),uploadProductImages,
        resizeProductImages,updateProductValidator, updateproduct)
    .delete(authServices.auth,
        authServices.allowedTo("admin"),deleteProductValidator, deleteproduct);

module.exports = router;
