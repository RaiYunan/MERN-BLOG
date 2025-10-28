import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim:true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    status:{
      type:String,
      enum:["Pending","Rejected","Approved","Spam"],
      default:"Approved",
      index:true
    }
  },
  { timestamps: true }
);

export const Comment=mongoose.model("Comment",commentSchema);
