const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId",userAuth, async(req,res)=>{
    const {targetUserId}=req.params;
    const userID = req.user._id;
    try{
        let chat  = await Chat.findOne({
            participants:{$all:[userID, targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName photoUrl",
        });
        if(!chat){
            chat = new Chat({
                participants:[userID,targetUserId],
                messages:[],
            })
            await chat.save();
        }
        res.json(chat)
    }catch(err){
        console.error(err)
    }
})

module.exports= chatRouter;