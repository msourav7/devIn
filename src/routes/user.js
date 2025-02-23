const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest")

//Get all the pending requests for the loggedIn user, for this first we need apply validation if the user is loggedIn or not
userRouter.get("/user/requests/recevied",userAuth,async(req,res)=>{
    try{
      const loggedInUser = req.user;//assigning loggedInUser to variable from req.user from userAuth
      const connectionRequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,//if the corredct user is loggedIn or not
        status: "intrested", //to only see who are intrested in you otherwise it show all the data ex. rejected, ignored etc
      }).populate("fromUserId",["firstName","lastName","photoUrl"])//this data is coming from userCollection cuz link is created with "ref" in connectionRequest table
    }catch(err){
        req.status(400).send("ERROR: " + err.message )
    }
})

module.exports=userRouter