const express = require("express");
const requestRouter=express.Router();

const {userAuth}=require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

//toUserId is the reciever 
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    //below line brings all the details of the user and this comes form userAuth
    // const user = req.user;
    // console.log("Sending a connection Request")
    // res.send(user.firstName + " has sent the connection request.")
    
    try{
      //you will call this userAuth u'll get loggedIn user inside the req.user 
      const fromUserId=req.user._id;
      //now to get the toUserId it will come from my params
      const toUserId=req.params.toUserId;
      const status = req.params.status;

      //the stauts type should only be either ignored or intrestes but not accepted
      const allowedStatus = ["ignored","intrested"];
      if(!allowedStatus){
        return res.status(400).json({message: "Invalid status type: " + status});
      }

      //to chek the req we are sending to is even present in our DB or not
      let toUser;
      try {
         toUser = await User.findById(toUserId);
        if (!toUser) {
          return res.status(404).json({ message: "User not found!" });
        }
      
        // Continue processing if user exists...
      } catch (error) {
        return res.status(404).json({ message: "User not found!" });
      }

      //to check if sourav is not sending connec. req to sourav himself
      // ----> dealing this validation in connectionRequest model , check there 

      //Now we'll check if there is an existing ConnectionRequest ex. one cant send more than one req to same person and after 1 sent req to 2nd then 2nd should also not sendthe req to 1st
       const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {fromUserId,toUserId},//to check if fromuserId and toUserId is present or not
          {fromUserId:toUserId,toUserId:fromUserId},//to check request sent to each other
        ]
       })
       if(existingConnectionRequest){
        return res.status(400).send("Connection Request Already exists")
       }
     
      //creating a new instance for ConnectionRequest because now instead of making two different apis of intrested and ignore ["/request/send/intrested/:toUserId" & "/request/send/ignored/:fromUserId"]we will call our api dynamically as /:statuss
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId, 
        status,
      })

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      })
    }catch(err){
      res.status(400).send("ERROR: " + err.message) 
    }
  })


  //This is for the user if he accepts the request or not , here only toUserId can accept the request , the toUserId should be loggedIN user to check if connection request is came or not 
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params;

    //this is for if someone dont enter other than this status
    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Status not allowed! "})
    }

    //this is for to check if the toUserId is same as the loggedIn user to accept , this will make sure that sourav only is acceting the intrested request
    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,//toUserId is same as the loggedIn
      status:"intrested",
    })
    if(!connectionRequest){
      return res.status(404).json({message: "Connection request not found"}) // it will throw this error when you are acceptig the req from the same id you need to change the login where req was sent
    }
 
    //changing status to either intrested or rejected , comming from here _id:requestId,toUserId:loggedInUser._id status:intrested, and saving the status finally
    connectionRequest.status = status;
    const data = await connectionRequest.save();   //saving modified connection status
    res.json({message : "Connection request " + status,data})

  }catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports=requestRouter;