const Path = require('path');
const cors = require("cors");
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const compression = require('compression')


const mountRoute=require("./routes");

const ApiError = require("./utils/apiError");

const globalError = require('./middleware/errorMiddleware');

dotenv.config({ path: 'config.env' });
const dbConnect = require('./config/database');


// Connect with db
dbConnect();

// express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.options("*",cors());
// compress all responses 
app.use(compression());
app.use(express.static(Path.join(__dirname + '/uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoute(app);



app.all('*', (req, res, next) => {


  next(new ApiError(`can not find this route ${req.originalUrl}`, 400));
})

app.use(globalError);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});


//Hande erros outside express.
process.on("unhandledRejection", (e) => {
  console.log(`unhandledRejection Error ${e.name} | ${e.message}`);
  server.close(() => {
    console.error(`Shutting down...`)
    process.exit(1);

  })
})
