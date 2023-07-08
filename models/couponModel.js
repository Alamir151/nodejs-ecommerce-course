const mongoose = require('mongoose');

const couponSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:[true,"Coupon name required"],
        unique:true
    },expire:{
        type:Date,
        required:[true,"expiration Date required"],
    },discount:{
        type:Number,
        require:[true,"Coupon discount value required"]
    }

},{timestamps:true});

module.exports=mongoose.model('Coupon',couponSchema);