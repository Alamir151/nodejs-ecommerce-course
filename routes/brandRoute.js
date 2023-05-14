

const express = require('express');
const { getBrandValidator,
    createBrandValidator, updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validator/brandValidator');


const { getBrands,
    getbrand
    , createbrand,
    updatebrand,
    deletebrand
} = require('../services/brandService');


const router = express.Router();


router.route("/").get(getBrands).post(createBrandValidator, createbrand);
router.route("/:id").get(getBrandValidator,
    getbrand
).
    put(updateBrandValidator, updatebrand)
    .delete(deleteBrandValidator, deletebrand);

module.exports = router;
