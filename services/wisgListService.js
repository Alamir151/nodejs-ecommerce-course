const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");


//@desc add product to wish list
//@route POST /api/v1/withLish
//@access private/user

exports.addProductToWishList = asyncHandler(async function (req, res, next) {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishList: req.body.productId }
    }, { new: true });
    res.status(200).json({
        success: true,
        message: "Product added successfully to your wishList.", data: user.wishList
    });
})

//@desc remove product from wish list
//@route DELETE /api/v1/withLish/:productId
//@access private/user

exports.removeProductFromWishList = asyncHandler(async function (req, res, next) {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { wishList: req.params.productId }
    }, { new: true });
    res.status(200).json({
        success: true,
        message: "Product removed successfully from your wishList.", data: user.wishList
    });
});

//@desc get logged user wish list
//@route GET /api/v1/withLish
//@access private/user
exports.getLoggedUserWishList = asyncHandler(async function (req, res, next) {
    const user = await userModel.findById(req.user._id).populate("wishList");
    res.status(200).json({
        success: true, data: user.wishList
    })
});