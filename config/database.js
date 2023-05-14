const mongoose = require("mongoose");

const dbConnection=()=>{
    //connect to db
mongoose
.connect(`${process.env.DB_URI}`,{ useNewUrlParser: true, useUnifiedTopology: true })
.then((conn) => {
  console.log(`Database connect ${conn.connection.host}`);
})
// .catch((e) => {
//   console.log(`Dabase conntect Error ${e}`);
//   process.exit(1);
// });
}

module.exports=dbConnection