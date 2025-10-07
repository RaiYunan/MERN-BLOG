import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const addCategory = asyncHandler(async (req, res, next) => {
  const { name, slug } = req.body;

  const category = await Category.create({
    name: name,
    slug: slug,
  });

  if (!category) {
    throw new ApiError(400, "Something went wrong while adding Category");
  }
  console.log("Category saved", category);
  res
    .status(200)
    .json(new ApiResponse(200, category, "Category added successfully"));
});

export const showCategory = asyncHandler(async (req, res, next) => {
  const {categoryId}=req.params
  const category=await Category.findById(categoryId);
  if(!category){
    throw new ApiError(404,"Catgeory missing.")
  }

  res.status(200).json(new ApiResponse(200,category,"Category fetched Successfully"))
});

export const editCategory = asyncHandler(async (req, res, next) => {
  const {categoryId}=req.params
  const {name,slug}=req.body
  if(!categoryId){
    throw new ApiError(404,"Catgeory ID is missing!");
  }

  const category=await Category.findByIdAndUpdate(categoryId,{
    name:name,
    slug:slug
  },{
    new:true
  })

  if(!category){
    throw new ApiError(400,"Something went wrong while updating category.")
  }

  console.log("Updated Category:\n",category)

  res.status(200).json(new ApiResponse(200,category,"Category edited sucessfully."))
});

export const deleteCategory = asyncHandler(async (req, res, next) => {});

export const getAllCategories = asyncHandler(async (req, res, next) => {
  //Fetches all categories from the database.
  //Returns: Newest documents first (most recent at top)
  //Returns them as plain JavaScript objects (not Mongoose documents).
  // Waits for the query to complete and returns the result.
  const categories = await Category.find().sort({ name: -1 }).lean().exec();

  res
    .status(200)
    .json(new ApiResponse(200, categories, "All categories fetched successfully."));
});
