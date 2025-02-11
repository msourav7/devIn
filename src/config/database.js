const mongoose = require("mongoose")

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://msourav4455:Qwerty!123@cluster0.zk35hws.mongodb.net/devIn"
    )
}

module.exports=connectDB;


