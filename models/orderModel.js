const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Ordermustbe beloges to user"],
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "products"
            },
            quantity: { type: Number },
            color: String,
            price: Number,
        }
    ],
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalOrderPrice: { type: Number, default: 0 },
    paymentMethodType: {
        type: String,
        enum: ["cart", "cash"],
        default: "cash"
    },
    shippingAddress:{
        details:String,
        phone:String,
        city:String,
        postalCode:String
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliverAt: { type: Date },




}, { timestamps: true });
orderSchema.pre(/find/,function(next){
    this.populate({path:"user", select:"name profileImage email phone"})
    .populate({path:"cartItems.product" , select:"title imageCover price"});
    next();
})

const Order = mongoose.model("Order", orderSchema);
module.exports=Order;