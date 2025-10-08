import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const getAllBlogs = asyncHandler(async (req, res, next) => {

});
export const showBlog=asyncHandler(async(req,res,next)=>{

})

export const editBlog=asyncHandler(async(req,res,next)=>{

})

export const addBlog=asyncHandler(async(req,res,next)=>{
    const {category,title,slug,blogContent}=req.body
    console.log("data in body",req?.body?.data)
    console.log("Image in file",req?.file)

    res.status(200).json(new ApiResponse(200,{},"Blog added successfully"))

})

export const deleteBlog=asyncHandler(async(req,res,next)=>{

})