const express= require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const categoryRoute=require('./routes/categoryRoute');
const brandRoute=require('./routes/brandRoute');


const ApiError=require("./utils/apiError");

const globalError=require('./middleware/errorMiddleware');



const subCategoryRoute=require('./routes/subCategoryRoute');
const productRoute=require('./routes/productRoute');

dotenv.config({ path: 'config.env' });
const dbConnect=require('./config/database');


// Connect with db
dbConnect();

// express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);


app.use('/api/v1/subCategories', subCategoryRoute);
app.all('*',(req,res,next)=>{
  
  
  next(new ApiError(`can not find this route ${req.originalUrl}`,400));
})

app.use(globalError);
const PORT = process.env.PORT || 8000;
const server=app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});


//Hande erros outside express.
process.on("unhandledRejection",(e)=>{
    console.log(`unhandledRejection Error ${e.name} | ${e.message}`);
server.close(()=>{
  console.error(`Shutting down...`)
  process.exit(1);

})
})
