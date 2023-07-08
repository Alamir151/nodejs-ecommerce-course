const categoryRoute = require('./categoryRoute');
const brandRoute = require('./brandRoute');
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const wishListRoute = require("./wishListRoute");
const addressRoute = require("./addressRoute");

const reviewhRoute = require("./reviewRoute");
const couponRoute = require("./couponRoute");
const subCategoryRoute = require('./subCategoryRoute');
const productRoute = require('./productRoute');
const cartRoute = require('./cartRoute');
const orderRoute = require('./orderRoute');




const mountRoute = (app) => {
    app.use('/api/v1/categories', categoryRoute);
    app.use('/api/v1/brands', brandRoute);
    app.use('/api/v1/products', productRoute);
    app.use('/api/v1/reviews', reviewhRoute);
    app.use('/api/v1/wishList', wishListRoute);
    app.use('/api/v1/addresses', addressRoute);
    app.use('/api/v1/coupons', couponRoute);
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/subCategories', subCategoryRoute);
    app.use('/api/v1/cart', cartRoute);
    app.use('/api/v1/orders', orderRoute);



}
module.exports = mountRoute