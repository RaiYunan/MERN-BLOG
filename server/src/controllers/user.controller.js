import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Blog } from "../models/blog.model.js";

export const getUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required!");
  }

  const user = await User.findOne({ _id: userId }).lean().exec();

  if (!user) {
    throw new ApiError(400, "User not found.");
  }

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // Validate
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Parse the JSON "data" field from FormData
  let data = {};
  if (req.body.data) {
    try {
      data = JSON.parse(req.body.data);
    } catch (err) {
      throw new ApiError(400, "Invalid data format (data must be JSON)");
    }
  }

  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  const updateFields = {};
  // Avatar path from multer
  if (req.file?.path) {
    const avatarLocalPath = req.file?.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar || !avatar.secure_url) {
      throw new ApiError(400, "Avatar file is missing!!");
    }

    updateFields.avatar = avatar.secure_url;
  }

  if (data.name) {
    updateFields.name = data.name.trim();
  }
  if (data.bio !== undefined) {
    updateFields.bio = data.bio;
  }
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found");

  Object.assign(user, updateFields);
  await user.save();
  // Update user in MongoDB

  const updatedUser = await User.findById(userId).select(
    "-password -refreshToken"
  );
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  console.log("updatedUser:", updatedUser);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().lean().exec();
  //Find all users, return plain JS objects (not Mongoose documents), and execute immediately

  if (!users) {
    throw new ApiError(404, "User(s) not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users retrieved successfully."));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new ApiError(404, "User not found.");
  }
  await Like.deleteMany({ author: userId });
  // 2. Update blogs to remove user's likes and decrement likeCount
  await Blog.updateMany(
    { likes: { $in: [userId] } }, // Find blogs that have this user's likes
    {
      $pull: { likes: userId },
      $inc: { likeCount: -1 }, // Decrement likeCount for each like removed
    }
  );
  // 2. Clear cookies (same as logout)
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});
