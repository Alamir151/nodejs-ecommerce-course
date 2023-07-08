const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minLength: [3, 'too short prodcut title'],
        maxLength: [100, 'too lomg product title'],
    }, slug: {
        type: String,
        required: true,
        lowercase: true,
    }, description: {
        type: String,
        required: [true, 'prodcut description is requierd'],
        minLength: [20, 'too short prodcut description'],

    },
    quantity: {
        type: Number,
        required: [true, 'prodcut quantity is requierd'],

    }, sold: {
        type: Number,
        default: 0,
    }, price: {
        type: Number,
        required: [true, 'prodcut price is requierd'],
        trim: true,
        max: [200000, 'too long product price'],

    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, 'product image cover is requierd'],
    }, images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'product category is requierd'],
    }, subcategory:
        [{ type: mongoose.Schema.ObjectId, ref: 'subcategories' }],
    barnd: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand'
    },
    ratingAverage: {
        type: Number,
        min: [1, 'rating average must be above or equal 1.0'],
        max: [5, "rating average must be below or equal 5.0"]

    }, ratingsQuantity: {
        type: Number,
        default: 0,
    }


}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictPopulate: false })

// mongoose query middlen]
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: "category",
        select: "name"
    });

    next();

});
const setImageUlr = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`
        doc.imageCover = imageUrl;

    }
    if (doc.images) {
        const images = [];
        doc.images.forEach(image => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            images.push(imageUrl);
        });
        doc.images = images;
    }
}

productSchema.post('init', function (doc) {
    //return image base url+ image name
    setImageUlr(doc);

});
productSchema.post('save', function (doc) {
    //return image base url+ image name
    setImageUlr(doc);

});
productSchema.virtual("reviews",
    { ref: "Review", foreignField: "product", localField: "_id" }
)
//   productSchema.pre(/^find/,function(next){
//     this.populate({path:"reviews",select:"title"});
//     next();
//   })
const product = mongoose.model('products', productSchema);

module.exports = product;
