import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
export const addComment = asyncHandler(async (req, res, next) => {
  const { comment, blogId, authorId } = req.body;
  if (!comment || !comment.trim().length== 0) {
    throw new ApiError(404, "Comment content is required");
  }
  const newComment =await Comment.create({
    content: comment.trim(),
    blogId: blogId,
    author: authorId,
  });
  await newComment.populate("author","name avatar");
  res.status(200).json(new ApiResponse(200,newComment,"Comment added successfully"))
});

export const deleteComment = asyncHandler(async (req, res, next) => {});
