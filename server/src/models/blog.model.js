import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    blogContent: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Blog=mongoose.model("Blog",blogSchema)