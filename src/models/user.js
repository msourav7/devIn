const mongoose=require("mongoose")
const validator=require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
        
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email ID" + value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password" + value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
        // required:true,
    },
    gender:{
        type:String,
        // required:true,
        //This is the ex of prebuild mongoose validation
        // enum:{
        //     values: ["male","female","others"],
        //     message: `{VALUE} is not a valid GENDER type`
        // },

        //this is a custom validation
        validate(value){
            if(!["male","female","others"].includes(value.toLowerCase())){
                throw new Error("Gender not recognised")
            }
        },set: (value) => value.toLowerCase()
    },
    photoUrl:{
        type:String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/045/711/185/small_2x/male-profile-picture-placeholder-for-social-media-forum-dating-site-chat-operator-design-social-profile-template-default-avatar-icon-flat-style-free-vector.jpg", // Default profile picture
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Please enter a valid JPEG image URL");
            }
        }
    },
    // photoUrl: {
    //     type: String,
    //     default: "https://static.vecteezy.com/system/resources/thumbnails/045/711/185/small_2x/male-profile-picture-placeholder-for-social-media-forum-dating-site-chat-operator-design-social-profile-template-default-avatar-icon-flat-style-free-vector.jpg",
    //     validate(value) {
    //       if (
    //         !validator.isURL(value) ||
    //         !/\.(jpeg|jpg)$/i.test(value) // <-- Check that URL ends with jpeg or jpg
    //       ) {
    //         throw new Error("Please enter a valid JPEG image URL");
    //       }
    //     },
    //   },
    about:{
        type:String,
        default: "No bio available",
    },
    isPremium:{
        type:Boolean,
        default: true,
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true,
})

// const token=await jwt.sign({firstName:user.firstName},"Prince@123"); creating this in User model instead of the app.js to simplify app.js code and we will get token for login from here
//getJWT this our made function name

//here we only use normal function and with anonymus function we use "this" const user=this; here "this" is refering to thas db user,********-> This is to validate the JWT if once user sign in then this will use to compare or validate the token which is inside the cookies with the help of its user_id
userSchema.methods.getJWT = async function (){
    const user=this;
    const token =await jwt.sign({_id:user._id},"Prince@123",{expiresIn:"1D"});
    console.log(token)
    return token
} 

//Same we will do for password ,********-> This is to compare/validate the password if user logs in.
userSchema.methods.validatePassword = async function (passwordInputByUser){//this passwordInputByUser is comming from the argument in login in auth.js and it will get compared by the passwordHash which is present in our databse in salted/hashed fromat & dont interchange the order of this bcrypt.compare(passwordInputByUser, passwordHash)
    const user = this;
    const passwordHash=this.password; // user.password both are same
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid;
}



const User = mongoose.model("User" , userSchema)

module.exports=User;

// module.exports = mongoose.model("User" , userSchema)