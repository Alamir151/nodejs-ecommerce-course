

const express = require('express');
const { getProductValidator,
    createProductValidator, updateProductValidator,
    deleteProductValidator
} = require('../utils/validator/productValidator');


const { 
    getproducts,
    getproduct
    , createproduct,
    updateproduct,
    deleteproduct
} = require('../services/productService');


const router = express.Router();


router.route("/").get(getproducts).post(createProductValidator, createproduct);
router.route("/:id").get(getProductValidator,
    getproduct
).
    put(updateProductValidator, updateproduct)
    .delete(deleteProductValidator, deleteproduct);

module.exports = router;
