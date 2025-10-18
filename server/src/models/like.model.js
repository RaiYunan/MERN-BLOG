import mongoose from "mongoose"

const likeSchema=new mongoose.Schema({
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
        required: true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },


},{timestamps:true})

export const Like=mongoose.model("Like",likeSchema);