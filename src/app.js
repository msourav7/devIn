const express  =require("express");
const app = express();

app.use("/", (req,res)=>{
    res.send("nameste");
} )

app.use("/hello",(req,res)=>{
    res.send("hello")
})

app.listen(7777,()=>{
    console.log("server is running...")
})