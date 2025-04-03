const jwt = require("jsonwebtoken")
const User = require("../models/user")

//This userAuth is a middleware which we can add in the APIs such as /sendConnectionRequest, /profile api leaving signup and login to compare/validate the token inside the cookies for different apis requests

const userAuth =async (req,res,next)=>{
    try{
        //Read the token from the req cookies
        const cookies = req.cookies;
        const {token}=cookies;  //  const {token}=req.cookies;
        if(!token){
            return res.status(401).send("Please Login...")
        }
      
       const decodedObj= await jwt.verify(token,process.env.JWT_SECRET)
      
       const {_id}=decodedObj;
       //To return all the user data using its _id, if the user is ther in db then it'll find and assign to req object, 
       // req.user=user
       const user=await User.findById(_id)
       if(!user){
          throw new Error("User not Valid")
       }
       req.user=user; //sending all the user loggedIn detail to req.user
       next(); // so whenever we'll user userAuth middle.. this req will carry the detail of the loggedIn user
    }catch(err){
       res.status(400).send("ERROR: "+ err.message)
    }

}
module.exports={
    userAuth,
};