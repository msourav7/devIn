const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

 //This job will run at 8am everyday
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1); // Corrected: Get previous day
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    // Fetch all pending requests from yesterday
    const pendingRequests = await ConnectionRequestModel.find({
      status: "intrested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId"); // Ensure user details are included

    // console.log("Pending Requests:", pendingRequests); // Debugging

    // Extract unique emails
    const listOfEmails = [...new Set(
        pendingRequests
          .filter(req => req.toUserId) // Exclude records where `toUserId` is null
          .map(req => req.toUserId.emailId) // Extract email
      )];

    // console.log("Emails to notify:", listOfEmails); // Debugging

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New Friend Request pending for " + email,
          "Please Log in and check for more..."
        );
        // console.log("Email sent:", res);
      } catch (err) {
        console.error("Email error:", err);
      }
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
