const express = require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth")


requestRouter.post("/sendConnectionRequest",userAuth,(req,res)=>{
    //below line brings all the details of the user and this comes form userAuth
    const user = req.user;
    console.log("Sending a connection Request")
    res.send(user.firstName + " has sent the connection request.")
  })

module.exports=requestRouter;