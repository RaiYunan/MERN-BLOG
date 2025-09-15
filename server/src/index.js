import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import {name} from "../../client/src/assets/sample.js"

dotenv.config({
    path:"./.env"
});

const app=express();
const port=process.env.PORT

app.use(cookieParser());

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"));

app.get("/", (req, res) => {
 res.json({
    name:"Yunan Rai",
    age:18,
    crush:name
 })
});

app.get("/api/data",(req,res)=>{
    res.json({message:`I like ${name}`});
})

app.listen(port,()=>{
console.log("Server running on ", port);
console.log(name)
})