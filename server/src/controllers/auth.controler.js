import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body

    const existedUser=await User.findOne({email}).select("-password")

    if(existedUser){
        console.log("\nDuplicate User found:",existedUser);
        throw new ApiError(409,"User with given email is already registered!!");
    }

    const user=await User.create({
        name,
        email,
        password
    })

    const createdUser=await User.findById(user._id).select("-password")

    console.log("User Details:\n",createdUser)

    res.status(200).json(
        new ApiResponse(200,createdUser,"User registered successfully!!")
    )

})

export const loginUser=asyncHandler(async(req,res)=>{
   //code to be written
})