

const express = require('express');
const { getBrandValidator,
    createBrandValidator, updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validator/brandValidator');


const { getBrands,
    getbrand
    , createbrand,
    updatebrand,
    deletebrand,
    uploadBrandImage,
    resizeImage
} = require('../services/brandService');
const authServices=require("../services/authService");


const router = express.Router();


router.route("/").get(getBrands).post(authServices.auth,
    authServices.allowedTo("admin","manager"),uploadBrandImage,resizeImage,createBrandValidator, createbrand);
router.route("/:id").get(getBrandValidator,
    getbrand
).
    put(authServices.auth,
        authServices.allowedTo("admin","manager"),uploadBrandImage,resizeImage,updateBrandValidator, updatebrand)
    .delete(authServices.auth,
        authServices.allowedTo("admin"),deleteBrandValidator, deletebrand);

module.exports = router;
