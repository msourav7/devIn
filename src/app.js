const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const {userAuth}=require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    const {firstName,lastName,emailId, gender,age,password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //creating the new instance of the User model
    //const user = new User(req.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age
    });
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/login",async(req,res)=>{
  try{
    const {emailId,password}=req.body;

    const user=await User.findOne({emailId:emailId})
    if(!user){
      throw new Error("Email ID is Invalid")
    }

    const isPasswordValid=await bcrypt.compare(password, user.password)//password is comming from req.body which we are entering and user.password is coming from th db in hash format the both will get compared & User.findOne(...) returns the full object,This object contains all fields stored in the database for that user, including emailId, password, and any other properties.
    if(isPasswordValid){
      //Create the JWT Token
     
      // const token=await jwt.sign({firstName:user.firstName},"Prince@123");
      const token=await jwt.sign({_id:user._id},"Prince@123",{expiresIn:"1D"});
      console.log(token)

      //Add the token to cookie and send the response back to the user
      res.cookie("token",token);
      res.send("Login Successful...")
    }else{
      throw new Error("Password is not correct")
    }
  }catch (err) {
    res.status(400).send("ERROR"+err.message);
  }
})

app.get("/profile",userAuth,async(req,res)=>{
  try{ 
   //To return all the user data using its _id
   //The req.user comming from the userAuth middleware which contanis the validated user data  
   const user = req.user;
  
   res.send(user)}catch (err) {
    res.status(400).send("ERROR"+err.message);
  }
})

app.post("/sendConnectionRequest",userAuth,(req,res)=>{
  //below line brings all the details of the user and this comes form userAuth
  const user = req.user;
  console.log("Sending a connection Request")
  res.send(user.firstName + " has sent the connection request.")
})

// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.find({ emailId: userEmail });
//     if (user.length === 0) {
//       res.status(404).send("not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //Get all the User data
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // Delete the user by id
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     // const user = await User.findByIdAndDelete({_id:userId})
//     const user = await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //Update the data of the user
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//       "password",
//     ];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Skills limit exceded");
//     }

//     // const user=await User.findByIdAndUpdate(userId,data)
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("Update failed" + err.message);
//   }
// });

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("server is running...");
    });
  })
  .catch((error) => {
    console.error("database cant be connected");
  });
