const express = require("express");
const { model } = require("mongoose");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //To return all the user data using its _id
    //The req.user comming from the userAuth middleware which contanis the validated user data
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
      //or
      //return res.status(400).send("Invalid edit request")
    }
    const loggedINuser = req.user; //comming from userAuth , this contains the user already present in the database and now we have to update it with the new updated data which is coming from req.body
    Object.keys(req.body).forEach((key) => (loggedINuser[key] = req.body[key]));

    await loggedINuser.save();

    res.json({
      message: `${loggedINuser.firstName}, Your profile updated successfully`,
      data: loggedINuser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
