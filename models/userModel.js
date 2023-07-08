const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "User name required"],

    }, slug: {
        type: String,
        lowercase: true,
    }, email: {
        type: String,
        required: [true, "email required"],
        unique: true,
        lowercase: true,
    }, phone: String,
    active: {
        type: Boolean,
        default: true,
    },
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerfied: Boolean,
    profileImage: String,
    password: {
        type: String,
        required: [true, "password required"],
        minlength: [6, "Too short password :"]
    }, passwordChangedAt: Date,
    role: {
        type: String,
        enum: ["admin", "manager", "user"],
        default: "user",
    },
    wishList: [{
        type: mongoose.Schema.ObjectId,
        ref: "products"
    }], addresses: [{
        id: { type: mongoose.Schema.ObjectId },
        alias: String,
        deltails: String,
        phone: String,
        city: String,
        postalCode: String
    }]


}, { timestamps: true });
//password Hashing
userSchema.pre("save", async function (next) {

    this.password = await bcrypt.hash(this.password, 12);
    next();

});

const User = mongoose.model("User", userSchema);
module.exports = User;