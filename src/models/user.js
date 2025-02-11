const mongoose=require("mongoose")
const validator=require("validator")

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

const User = mongoose.model("User" , userSchema)

module.exports=User;

// module.exports = mongoose.model("User" , userSchema)