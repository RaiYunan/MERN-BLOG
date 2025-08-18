import express from "express"
import dotenv from "dotenv"

import {name} from "../../client/src/assets/sample.js"
dotenv.config({
    path:"./.env"
});
const app=express();

const port=process.env.PORT

app.get("/",(req,res)=>{
    res.send("Hello");
})
app.get("/api/data",(req,res)=>{
    res.json({message:`I like ${name}`});
})

app.listen(port,()=>{
console.log("Server running on ", port);
console.log(name)
})