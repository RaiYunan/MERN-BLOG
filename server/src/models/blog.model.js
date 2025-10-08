import mongoose from "mongoose";

const blogSchema=new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
    blogContent:{
        type:String,
        required:true
    },
    image:{
        type:String,
        trim:true
    }
},{timestamps:true})