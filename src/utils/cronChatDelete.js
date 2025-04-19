const cron = require("node-cron");
const {Chat} = require("../models/chat");
const {subHours,subMinutes} = require("date-fns");

cron.schedule("0 * * * *", async () => {
    try {
      const cutoff = subHours(new Date(), 48); // 48 hours ago
  
      const chats = await Chat.find();
  
      for (const chat of chats) {
        // Filter messages to keep only recent ones
        const updatedMessages = chat.messages.filter(
          msg => msg.createdAt >= cutoff
        );
  
        if (updatedMessages.length !== chat.messages.length) {
          chat.messages = updatedMessages;
          await chat.save();
          console.log(`Cleaned old messages from chat ${chat._id}`);
        }
      }
  
      console.log("Old messages cleanup job completed.");
    } catch (err) {
      console.error("Error during message cleanup:", err.message);
    }
  });