const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

const USER_SAFE_DATA= "firstName lastName photoUrl age gender skills about"

//Get all the pending requests for the loggedIn user, for this first we need apply validation if the user is loggedIn or not
userRouter.get("/user/requests/recevied",userAuth,async(req,res)=>{
    try{
      const loggedInUser = req.user;//assigning loggedInUser to variable from req.user from userAuth
      const connectionRequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,//if the corredct user is loggedIn or not
        status: "intrested", //to only see who are intrested in you otherwise it show all the data ex. rejected, ignored etc
      }).populate("fromUserId",["firstName","lastName","photoUrl"])//this data is coming from userCollection cuz link is created with "ref" in connectionRequest table
      res.send(connectionRequest)
    }catch(err){
        res.status(400).send("ERROR: " + err.message )
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
      const loggedInUser = req.user;
      const connectionRequest = await ConnectionRequest.find({
        $or:[ //finding all the connections where loggedInUser could be from toUserId or fromUserId where status is accepted
            {toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"},
        ],
      }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
       // Map/loop the data to show only the other person's details
      const data = connectionRequest.map((row)=>{//to loop al the data inside the connections
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){ //to only get data/detail of from or toUserId
            return row.toUserId//if fromUserId is logged in then show connection req of toUserId and vise versa otherwise it will show all the connections OR If logged-in user is the sender, show receiver's details
        }  
        return row.fromUserId // If logged-in user is the receiver, show sender's details OR Shows only the other person's details (not the logged-in user's own details).
    })
      res.json({data})

    }catch(err){
      res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
      const loggedInUser = req.user;

      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10
      limit = limit>50?50:limit; //if someone asked for more than 50 profiles show him either 50 or th limit which is 10 

      const skip = (page-1)*limit;

      //Find all connectionRequest (sent + received)
      const connectionRequest = await ConnectionRequest.find({
        $or:[{fromUserId:loggedInUser},{toUserId:loggedInUser}],
      }).select("fromUserId toUserId")

      //Here we'll user as dsa Set() it will only add that data in the array which is unique (here we'll add unique connections only not more than one)
      const hideUsersFromFeed = new Set();
      connectionRequest.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      })
      console.log(hideUsersFromFeed)// these are the people who i want to hide from my field

      //Now db call to explained below
      const users = await User.find({
        $and:[ 
          {_id:{$nin: Array.from(hideUsersFromFeed)}},//Finding all the users who are not in this array set of hideUsersFromFeed,($nin not in this array)
          {_id: {$ne : loggedInUser._id}},]//And their Id is not equal to the loggedInUser id
      }).select(USER_SAFE_DATA).skip(skip).limit(limit)

    //   res.send(connectionRequest)
      res.send(users)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports=userRouter