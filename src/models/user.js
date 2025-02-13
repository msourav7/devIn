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
        type:String
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
        required:true,
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","others"].includes(value.toLowerCase())){
                throw new Error("Gender not recognised")
            }
        },set: (value) => value.toLowerCase()
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL" + value);
            }
        }
    },
    about:{
        type:String,
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true,
})

// const token=await jwt.sign({firstName:user.firstName},"Prince@123"); creating this in User model instead of the app.js to simplify app.js code and we will get token for login from here
//getJWT this our made function name

//here we only use normal function and with anonymus function we use "this" const user=this; here "this" is refering to thas db user
userSchema.methods.getJWT = async function (){
    const user=this;
    const token =await jwt.sign({_id:user._id},"Prince@123",{expiresIn:"1D"});
    console.log(token)
    return token
}

//Same we will do for password 
userSchema.methods.validatePassword = async function (passwordInputByUser){//this passwordInputByUser is comming from the argument in login in user.js and it will get compared by the passwordHash & dont interchange the order of this bcrypt.compare(passwordInputByUser, passwordHash)
    const user = this;
    const passwordHash=this.password; // this.password both are same
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid;
}

const User = mongoose.model("User" , userSchema)

module.exports=User;

// module.exports = mongoose.model("User" , userSchema)