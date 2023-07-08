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

const setImageUlr=(doc)=>{
  if(doc.image){
    const imageUrl=`${process.env.BASE_URL}/categories/${doc.image}`
    doc.image=imageUrl;

  }
}

categorySchema.post('init', function(doc) {
  //return image base url+ image name
  setImageUlr(doc);
  
});
categorySchema.post('save', function(doc) {
  //return image base url+ image name
  setImageUlr(doc);
  
});


const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
