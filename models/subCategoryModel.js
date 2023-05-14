const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, "subCategory must be unique"],
        minlength: [2, "too short subCategory name"],
        maxlength: [32, "too long subCategory name"]
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, "subCategory must be belong to main category"]
    }

}, { timestamps: true });
module.exports = mongoose.model('subcategories', subCategorySchema);