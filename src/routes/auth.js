const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login",async(req,res)=>{
    try{
      const {emailId,password}=req.body;
  
      const user=await User.findOne({emailId:emailId})
      if(!user){
        throw new Error("Email ID is Invalid")
      }
  
      const isPasswordValid=await user.validatePassword(password)
      //this validatePassword is commint from the the fun made in user.js
      // const isPasswordValid=await bcrypt.compare(password, user.password)  
      //password is comming from req.body which we are entering and user.password is coming from th db in hash format the both will get compared & User.findOne(...) returns the full object,This object contains all fields stored in the database for that user, including emailId, password, and any other properties.
      if(isPasswordValid){
        //Create the JWT Token
       
        // const token=await jwt.sign({firstName:user.firstName},"Prince@123");  getting this token validation from user model to clear the login api code  ,,  Creat a JWT Token required from user.js model 
        const token=await user.getJWT();
  
        //Add the token to cookie and send the response back to the user
        res.cookie("token",token);
        res.send("Login Successful...")
      }else{
        throw new Error("Password is not correct")
      }
    }catch (err) {
      res.status(400).send(" ERRORt " + err.message);
    }
  })  

module.exports=authRouter;