const validator = require("validator");

//req.body is whagt we are entering from our side
//validation for firstName,lastName,emailId,password ****-> This is for the first time when user Signs UP
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

//Validation for edit profile
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "password",
  ];

  //req.body is whagt we are entering from our side
  //only those things will be allowed to update which are present in the allowedEditFields
  const isEditAllowed=Object.keys(req.body).every((field)=>{
    return allowedEditFields.includes(field)
  })
 //isEditAllowed this will return a boolean true or false cus it uses includes?
  return isEditAllowed;

};

module.exports = {
  validateSignUpData,validateEditProfileData
};
