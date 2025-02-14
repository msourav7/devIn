const express = require("express");
const { model } = require("mongoose");
const profileRouter = express.Router();
const {userAuth}=require("../middlewares/auth")



profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{ 
     //To return all the user data using its _id
     //The req.user comming from the userAuth middleware which contanis the validated user data  
     const user = req.user;
    
     res.send(user)}catch (err) {
      res.status(400).send("ERROR"+err.message);
    }
  })

module.exports = profileRouter;