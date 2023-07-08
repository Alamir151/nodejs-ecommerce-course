const AsyncHandler = require('express-async-handler');
const Coupon=require("../models/couponModel");


const ApiError = require("../utils/apiError");
const productModel = require("../models/productModel");
const cartModel = require('../models/cartModel');
const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};

//@desc Add product to cart
//@route POST /api/v1/cart
//@access private/user 
exports.addProductToCart = AsyncHandler(async (req, res, next) => {
    //1)Get cart of logged user
    const { productId, color } = req.body;

    const product = await productModel.findOne({ _id: productId });

    let currentCart = await cartModel.findOne({ user: req.user._id });
    if (!currentCart) {
         currentCart = await cartModel.create({
            user: req.user._id,
            cartItems: [{
                product: productId,
                color: color,
                price: product.price
            }]
        })
    } else {
        //check if product exists in the cart if exists then update the quantity else push it to cart items 
        const productExist = currentCart.cartItems.findIndex((item) => item.product.toString() === productId && item.color === color);
        if (productExist > -1) {

            let cartItem = currentCart.cartItems[productExist];

            cartItem.quantity += 1;
            currentCart.cartItems[productExist] = cartItem;

        } else {
            currentCart.cartItems.push({ product: productId, color: color, price: product.price });
        }

    }
    //calculate total cart price
    calcTotalCartPrice(currentCart);


    await currentCart.save();
    res.status(200).json({ status: "success", msg: "product added to cart successfully", data: currentCart })
});
//@desc Get logged user cart
//@route POST /api/v1/cart
//@access private/user 
exports.getLoggedUserCart = AsyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(`there is no cart for user id:${req.user._id}`,404));
    }
    res.status(200).json({ NumOfCartItems: cart.cartItems.length, data: cart });
});

//@desc Remove cart  item
//@route DELETE /api/v1/cart/:itemId
//@access private/user 
exports.removeCartItem = AsyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, {
        $pull: { cartItems: { _id: req.params.itemId } }
    }, { new: true });
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({ NumOfCartItems: cart.cartItems.length, data: cart });

});
//@desc delete logged user cart
//@route DELETE /api/v1/cart
//@access private/user 
exports.clearCart=AsyncHandler(async(req, res, next) => {
    await cartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).send();
})


//@desc update specific cart item quantity
//@route PUT /api/v1/cart/:itemId
//@access private/user 
exports.updateCartItemQuantity = AsyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
       
        return next(new ApiError(`there is no cart for user id:${req.user._id}`), 404);
    } else {
        const itemIndex = cart.cartItems.findIndex((item) => item._id.toString()=== req.params.itemId);
        if (itemIndex > -1) {
            let cartItem = cart.cartItems[itemIndex];
            cartItem.quantity = quantity;
            cart.cartItems[itemIndex] = cartItem;

        } else {
            console.log("second");
            return next(new ApiError(`there is no item for this id:${req.params.itemId}`), 404);

        }
    }
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({ NumOfCartItems: cart.cartItems.length, data: cart });




})

//@desc Apply coupon on logged user cart
//@route PUT /api/v1/cart/applyCoupon
//@access private/user 

exports.applyCoupon=AsyncHandler(async(req, res, next)=>{
    //1)Get coupon based on coupon name
    const coupon=await Coupon.findOne({name:req.body.coupon, expire:{$gt:Date.now()}});
    if(!coupon){
        return next(new ApiError("Coupon invalid or expired",404));
    }
    //2) Get logged  user cart to get total cart price 
    const cart=await cartModel.findOne({user:req.user._id});
    let totalPrice=calcTotalCartPrice(cart);
    //3) calculate price after discount
    let totalPriceAfterDiscount=(totalPrice-(totalPrice*coupon.discount/100)).toFixed(2);
    cart.totalPriceAfterDiscount=totalPriceAfterDiscount;
    await cart.save();
    res.status(200).json({ NumOfCartItems: cart.cartItems.length, data: cart });



})