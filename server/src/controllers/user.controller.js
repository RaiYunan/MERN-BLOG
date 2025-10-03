import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

export const getUser=asyncHandler(async(req,res,next)=>{
    const {userId}=req.params

    if (!userId){
        throw new ApiError(400,"User ID is required!")
    }

    const user=await User.findOne({_id:userId}).lean().exec()

    if(!user){
        throw new ApiError(400,"User not found.")
    }

    res.status(200).json(new ApiResponse(200,user,"User fetched successfully"));

})

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

  console.log("req.body:", req.body)
  console.log("req.file:", req.file)

  const updateFields={}
  // Avatar path from multer
 if(req.file?.path){
   const avatarLocalPath = req.file?.path;
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  if(!avatar || !avatar.secure_url){
     throw new ApiError(400,"Avatar file is missing!!");
  }

  updateFields.avatar=avatar.secure_url
 }

 if(data.name){
  updateFields.name = data.name.trim();

 }
 if(data.bio!==undefined){
  updateFields.name = data.bio
 }
 if(data.password ||data.password.trim()!==""){
  updateFields.password=data.password
 }
  const updatedUser=await User.findByIdAndUpdate(
    userId,
    {
        $set:updateFields
    },
     {new:true,runValidators:true}
  ).select("-password -refreshToken")

  // Update user in MongoDB

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  console.log("updatedUser:",updatedUser)
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});
