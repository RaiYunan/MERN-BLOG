import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body

    const existedUser=await User.findOne({email})

    if(existedUser){
        console.log("\nDuplicate User found:",existedUser)
        throw Error(409,"User with given email is already registered!!");
    }

    const user=await User.create({
        name,
        email,
        password
    })

    res.status(200).json(
        new ApiResponse(200,user,"User registered successfully!!")
    )

})