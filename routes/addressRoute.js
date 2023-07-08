

const express = require('express');
const { getBrandValidator,
    createBrandValidator, updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validator/brandValidator');


const {
    addAddress,
    removeAddress,
    getLoggedUseraddresses
} = require('../services/addressService');
const authServices = require("../services/authService");


const router = express.Router();


router.route("/").get(authServices.auth, authServices.allowedTo("user"), getLoggedUseraddresses).
post(authServices.auth, authServices.allowedTo("user"),
    addAddress)

router.route("/:addressId").delete(authServices.auth,
    authServices.allowedTo("user"), removeAddress);
module.exports = router;
