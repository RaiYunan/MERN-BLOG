import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { encode } from "entities";

export const getAllBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find()
    .populate("author", "name email")
    .populate("category", "name")
    .lean()
    .exec();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        blogs,
        blogs.length > 0 ? "Blogs retrieved successfully." : "No blogs found."
      )
    );
});
export const showBlog = asyncHandler(async (req, res, next) => {
  const { blog_id } = req.params;
  if (!blog_id) {
    throw new ApiError(200, "Blog ID is missing.");
  }

  const blog = await Blog.findById(blog_id);
  console.log(blog);

  res
    .status(200)
    .json(new ApiResponse(200, blog, blog ? "Blog retrieved sucessfully." : "Blog not found"));
});

export const editBlog = asyncHandler(async (req, res, next) => {});

export const addBlog = asyncHandler(async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  console.log(data);
  const featuredImagePath = req?.file?.path;
  let featuredImage;
  if (featuredImagePath) {
    featuredImage = await uploadOnCloudinary(featuredImagePath);
  }

  const blog = await Blog.create({
    author: data.author,
    category: data.category,
    title: data.title,
    slug: data.slug,
    blogContent: encode(data.blogContent),
    featuredImage: featuredImage?.secure_url,
  });

  if (!blog) {
    throw new ApiError(400, "Something went wrong while adding blog.");
  }
  console.log("Blog created:\n", blog);
  res.status(200).json(new ApiResponse(200, blog, "Blog added successfully"));
});

export const deleteBlog = asyncHandler(async (req, res, next) => {});
