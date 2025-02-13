const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth =async (req,res,next)=>{
    try{
        //Read the token from the req cookies
        const cookies = req.cookies;
        const {token}=cookies;  //  const {token}=req.cookies;
        if(!token){
            throw new Error("Token not found");
        }
      
       const decodedObj= await jwt.verify(token,"Prince@123")
      
       const {_id}=decodedObj;
       //To return all the user data using its _id
       const user=await User.findById(_id)
       if(!user){
          throw new Error("User not Valid")
       }
       req.user=user;
       next();
    }catch(err){
       res.status(400).send("ERROR: "+ err.message)
    }

}
module.exports={
    userAuth,
};