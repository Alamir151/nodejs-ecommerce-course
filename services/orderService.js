const stripe = require('stripe')(`sk_test_51NRUdxAFVb881epNPy5CvfeMGx37HGQjlHw9tW0bP7zdtfaT7Dy1D7sQauvidTWtTyKj6oTsO7q1vL0Vf2U0tJOr00i03rzCNs`);
const AsyncHandler = require('express-async-handler');

const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

const factory = require('./handlersFactory');
const ApiError = require("../utils/apiError");
const { strip } = require('colors');

//@desc create cash Order
//@route POST api/v1/orders/cartId
//@access protected/User

exports.createCashOrder = AsyncHandler(async (req, res, next) => {
    //app setttings 
    const taxPrice = 0;
    const shippingPrice = 0;
    //1) get cart based on cartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`there is no such cart with id ${req.params.cartId}`));
    }

    //2) get order price depends on cart price (check if discount Coupon applied)
    let cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;

    const totalPrice = cartPrice + taxPrice + shippingPrice;
    //3)create cash Order
    const order = await orderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalPrice,
    });
    //4) After creating order , increment sold and decrement quantity of product 
    const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
            filter: {
                _id: item.product
            },
            update: {
                $inc: { quantity: -item.quantity, sold: +item.quantity }
            }
        }
    }));
    if (order) {
        await productModel.bulkWrite(bulkOption, {});
        //5)clear cart based on cartId
        await cartModel.findByIdAndDelete(req.params.cartId);

    }
    res.status(201).json({ status: "success", data: order });

});
exports.filterOrdersForLoggedUser = AsyncHandler(async (req, res, next) => {
    if (req.user.role === "user") {
        req.filterObject = { user: req.user._id }
    }
    next();
});

//@desc Get all user orders
//@route POST api/v1/orders
//@access protected/User-admin-manager
exports.getAllOrders = factory.getAll(orderModel);

//@desc Get single order
//@route POST api/v1/orders/:orderId
//@access protected/User-admin-manager
exports.getSingleOrder = factory.getOne(orderModel);

//@desc update order status to paid 
//@route PUt api/v1/orders/:id/pay
//@access protected/admin-manager
exports.updateOrderToPaid = AsyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`there is no such order with id ${req.params.id}`), 404);
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ status: "success", data: updatedOrder });

});
//@desc update order status to deliver 
//@route PUt api/v1/orders/:id/deliver
//@access protected/admin-manager
exports.updateOrderToDelivered = AsyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`there is no such order with id ${req.params.id}`), 404);
    }
    order.isDelivered = true;
    order.deliverAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ status: "success", data: updatedOrder });

});

//@desc Get checkout session from stripe and send it as response 
//@route GET api/v1/orders/checkout-session/cartId
//@access protected/User
exports.checkoutSession = AsyncHandler(async (req, res, next) => {
    //app setttings 
    const taxPrice = 0;
    const shippingPrice = 0;
    //1) get cart based on cartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`there is no such cart with id ${req.params.cartId}`));
    }

    //2) get order price depends on cart price (check if discount Coupon applied)
    let cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalPrice = cartPrice + taxPrice + shippingPrice;
    //3)- create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            quantity: 1,
            price_data: {


                currency: "egp",
                product_data: {
                    name: 'My product'
                },

                unit_amount: totalPrice * 100

            },

        }
        ],
        mode: 'payment',
        customer_email: req.user.email,
        client_refrence: cart._id,
        metadata: req.body.shippingAddress,
        success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    });
    res.status(200).json({ sucess: true, session });

})