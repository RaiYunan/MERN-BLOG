import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const generateAccessRefreshToken=async(userId)=>{
   try {
     const user=await User.findById(userId)

     const accessToken=user.generateAccessToken()
     const refreshToken=user.generateRefreshToken()

     user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false})
     return {accessToken,refreshToken}
   } catch (error) {
    console.error(error);
    throw new ApiError(400,"Something went wrong while generating Access and Refresh Tokens")
    
   }
}

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
        password,
        authProvider:"local",
    })

    const createdUser=await User.findById(user._id).select("-password")

    console.log("User Details:\n",createdUser)

    res.status(200).json(
        new ApiResponse(200,createdUser,"User registered successfully!!")
    )

})

export const loginUser=asyncHandler(async(req,res)=>{
   const {email,password}=req.body;

   const user=await User.findOne({email});

   if(!user){
    throw new ApiError(404,"No account found with this email. Please sign up to continue.")
   }

   if(user.authProvider==="google"){
    throw new ApiError(400,"This account was created with Google. Please login with Google.")
   }

   const isPasswordValid=await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(400,"Password is Incorrect! Try again!!")
   }

   const {accessToken,refreshToken}=await generateAccessRefreshToken(user._id);

   const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

   const options={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:process.env.NODE_ENV==="development"? "none":"strict",
    path:"/"
   }

   res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,
        loggedInUser,
        "User logged in successfully."
    )
   )

})

export const googleLogin=(asyncHandler(async(req,res,next)=>{
    const {name,email,avatar}=req.body
    let user
    user=await User.findOne({email});

    if(!user){
        ///create new user
        const newUser=await User.create({
            name,
            email,
            password:null,
            authProvider:"google",
            avatar
        })

        user=await newUser.save()
    }

    const {accessToken,refreshToken}=await generateAccessRefreshToken(user._id)

    const options={
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="development"?"none":"strict",
        path:"/"
    }

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    console.log(loggedInUser)

    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,loggedInUser,"User logged in Successfully.")
    )
}))