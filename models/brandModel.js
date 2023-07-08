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

const setImageUlr=(doc)=>{
  if(doc.image){
    const imageUrl=`${process.env.BASE_URL}/brands/${doc.image}`
    doc.image=imageUrl;

  }
}

brandSchema.post('init', function(doc) {
  //return image base url+ image name
  setImageUlr(doc);
  
});
brandSchema.post('save', function(doc) {
  //return image base url+ image name
  setImageUlr(doc);
  
});


const brandModel = mongoose.model('brand', brandSchema);

module.exports = brandModel;
