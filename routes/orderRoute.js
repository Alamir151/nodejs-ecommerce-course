

const express = require('express');

const { createCashOrder,
    getAllOrders,
    getSingleOrder,
    filterOrdersForLoggedUser,
    updateOrderToDelivered,
    updateOrderToPaid,
    checkoutSession
} = require('../services/orderService');
const authServices=require("../services/authService");


const router = express.Router();
router.use(authServices.auth);
router.get("/checkout-session/:cartId",authServices.allowedTo("user"),checkoutSession);
router.route("/:cartId").post(authServices.allowedTo("user"),createCashOrder);
router.get("/",authServices.allowedTo("user","admin","manager"),filterOrdersForLoggedUser,getAllOrders);
router.get("/:id",authServices.allowedTo("user","admin","manager"),filterOrdersForLoggedUser,getSingleOrder);
router.put("/:id/pay",authServices.allowedTo("admin","manager"),updateOrderToPaid);
router.put("/:id/deliver",authServices.allowedTo("admin","manager"),updateOrderToDelivered);



module.exports = router;
