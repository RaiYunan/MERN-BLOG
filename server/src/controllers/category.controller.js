import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const addCategory=asyncHandler(async(req,res,next)=>{
    const {name,slug}=req.body

    const category=await Category.create({
        name:name,
        slug:slug
    })

    if(!category){
        throw new ApiError(400,"Something went wrong while adding Category")
    }
    console.log("Category saved",category)
    res.status(200).json(new ApiResponse(200,category,"Category added successfully"));
})

export const showCategory=asyncHandler(async(req,res,next)=>{
    
})

export const editCategory=asyncHandler(async(req,res,next)=>{
    
})

export const deleteCategory=asyncHandler(async(req,res,next)=>{
    
})