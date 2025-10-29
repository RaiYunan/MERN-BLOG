import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
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
    blog:blogId,
    author:authorId
  })

  const updatedBlogWithLike=await Blog.findByIdAndUpdate(blogId,{
    $push:{likes:like._id},
    $inc:{likeCount:1}
  },{new:true}).populate({
    path:"likes",
    select:"author"
  })
  console.log(updatedBlogWithLike)
  res.status(200).json(new ApiResponse(200,updatedBlogWithLike,"Like added successfully"))
});

export const removeLike=asyncHandler(async(req,res,next)=>{
  const {blogId,authorId}=req.body;
  if(!blogId){
    throw new ApiError(404,"Blog ID is required..")
  }
  if(!authorId){
    throw new ApiError(404,"Author ID is required..")
  }
  const blog=await Blog.findById(blogId);
  if(!blog){
    throw new ApiError(404,"Blog not found");
  }

  const userLike=await Like.findOne({
    blog:blogId,
    author:authorId
  })
  await Blog.findByIdAndUpdate(blogId, {
    $pull: { likes: userLike._id },
    $inc: { likeCount: -1 }
  }).populate({
    path:"likes",
    select:"author"
  })

  await Like.findByIdAndDelete(userLike._id);

  const freshBlog = await Blog.findById(blogId);
  console.log(freshBlog);
  res.status(200).json(new ApiResponse(200,freshBlog,"Like removed successfully"));

})