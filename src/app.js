const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")
require('dotenv').config()
require("./utils/cronjob")

app.use(cors({
  origin:"http://localhost:5173",//whitelisting this domain name to use this in frontend  while api calling
  credentials:true,
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
      console.log("server is running...");
    });
  })
  .catch((error) => {
    console.error("database cant be connected");
  });
