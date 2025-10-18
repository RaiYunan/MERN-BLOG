import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const addLike = asyncHandler(async (req, res, next) => {
  const { blogId, authorId } = req.body;
  const blog = await Blog.findById(blogId);
  if(!blog){
    throw new ApiError(404,"Blog not found");
  }
  const like=await Like.create({
    blogId:blogId,
    author:authorId
  })

  const updatedBlogWithLike=await Blog.findByIdAndUpdate(blogId,{
    $push:{likes:like._id},
    $inc:{likeCount:1}
  },{new:true})
  console.log("updatedBlogWithLike\n",updatedBlogWithLike);
  res.status(200).json(new ApiResponse(200,updatedBlogWithLike,"Like added successfully"))
});
