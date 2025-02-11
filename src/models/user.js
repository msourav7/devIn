const mongoose=require("mongoose")

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
    },
    password:{
        type:String,
        required:true,
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