import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
export const addComment = asyncHandler(async (req, res, next) => {
  const { comment, blogId, authorId } = req.body;
  // Validation
  if (!comment?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  if (!authorId) {
    throw new ApiError(400, "Author ID is required");
  }

  // Check if blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  const newComment = await Comment.create({
    content: comment.trim(),
    blogId: blogId,
    author: authorId,
  });
  await newComment.populate("author", "name avatar");

  const newBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { comments: newComment._id },
      $inc: { commentCount: 1 },
    },
    { new: true }
  );

  console.log("newBlog", newBlog);
  res
    .status(200)
    .json(new ApiResponse(200, newComment, "Comment added successfully"));
});

export const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "Comment iD is required!!");
  }
  const comment = await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export const getBlogComments = asyncHandler(async (req, res, next) => {
  const { blogSlug } = req.params;
  console.log("Looking for blog with slug:", blogSlug); // Add logging

  const blog = await Blog.findOne({ slug: blogSlug })
    .populate({
      path: "comments", // ✅ Changed from "comment" to "comments"
      populate: {
        path: "author",
        select: "name avatar",
      },
      options: {
        sort: { createdAt: -1 }, // ✅ Moved options inside populate
      },
    })
    .select("comments commentCount")
    .lean();
  // ✅ Add null check
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        blog?.comments || [],
        "Comments fetched successfully"
      )
    );
});

export const getAllComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "name email avatar",
    })
    .populate({
      path: "blogId",
      populate: {
        path: "category",
        select: "name",
      },
      select: "blogContent title",
    });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        comments,
        comments ? "All comments retireved" : "No comments"
      )
    );
});

export const getMyComments = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "User Id is required");
  }

  const myComments = await Comment.find({
    author: userId,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "name email avatar",
    })
    .populate({
      path: "blogId",
      populate: {
        path: "category",
        select: "name",
      },
      select: "blogContent title",
    })
    .lean()
    .exec();

  res
    .status(200)
    .json(
      new ApiResponse(200, myComments, "My comments retrieved successfully")
    );
});
