const mongoose = require('mongoose');
// 1- Create Schema
const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "brand required"],
    unique: [true, 'brand name must be unique'],
    minLength: [3, "too short brand name"],
    maxLength: [32, "too long brand name"]

  }, slug: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true
  },
  image: String

}, { timestamps: true });


const brandModel = mongoose.model('brand', brandSchema);

module.exports = brandModel;
