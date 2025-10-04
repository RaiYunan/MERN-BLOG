import mongoose from "mongoose"

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    slug:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true,
        required:true
    },
    // user:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"User"
    // }
},{timestamps:true})

export const Category=mongoose.model("Category",categorySchema)