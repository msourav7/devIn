const validator=require("validator");


//validation for firstName,lastName,emailId,password ****-> This is for the first time when user Signs UP
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName||!lastName){
       throw new Error("Name is not valid")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong")
    }
}

module.exports={
    validateSignUpData,
}