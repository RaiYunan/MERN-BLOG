import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const getUser=asyncHandler(async(req,res,next)=>{
    console.log("params:", req.params)

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