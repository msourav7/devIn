const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
        // type: mongoose.Schema.Types.ObjectId--->,it means that this field stores a reference to another document's _id in MongoDB,here another document id mean User id , If you have a User model and a ConnectionRequest model, you can use ObjectId to reference a user. // References a User's _id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId, // References a User's _id
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

// this middleware "pre" will happen when i am just about to save the data in request.js , the .pre("save", save here here is acting like a event handler for pre method, this is called validation before saving.
connectionRequestSchema.pre("save", function (next){
    const connectionRequest=this;
    // Check if fromUserId is same as toUserId
     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
     }
     next();
})

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
