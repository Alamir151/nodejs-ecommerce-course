const mongoose = require('mongoose');
// 1- Create Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category required"],
    unique: [true, 'Category name must be unique'],
    minLength: [3, "too short category name"],
    maxLength: [32, "too long category name"]

  }, slug: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true
  },
  image: String

}, { timestamps: true });


const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
