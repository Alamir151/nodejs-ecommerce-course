const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");


//@desc add address touser addresses
//@route POST /api/v1/addresses
//@access private/user

exports.addAddress = asyncHandler(async function (req, res, next) {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    }, { new: true });
    res.status(200).json({
        success: true,
        message: "Address added successfully to your addresses.", data: user.addresses
    });
})

//@desc remove address from addresses
//@route DELETE /api/v1/withLish/:addressId
//@access private/user

exports.removeAddress = asyncHandler(async function (req, res, next) {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.addressId } }
    }, { new: true });
    res.status(200).json({
        success: true,
        message: "Address removed successfully from your addresses.", data: user.addresses
    });
});

//@desc get logged user wish list
//@route GET /api/v1/withLish
//@access private/user
exports.getLoggedUseraddresses = asyncHandler(async function (req, res, next) {
    const user = await userModel.findById(req.user._id).populate("addresses");
    res.status(200).json({
        success: true, data: user.addresses
    })
});