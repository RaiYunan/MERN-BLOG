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
    .sort({ createdAt: -1 })
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
export const getBlogBySlug = asyncHandler(async (req, res, next) => {
  const { category, slug } = req.params;

  const blog = await Blog.findOne({ slug: slug })
    .populate("author", "email name")
    .populate("category", "name");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        blog,
        blog ? "Blog retrieved successfully" : "Blog not found"
      )
    );
});
export const showBlog = asyncHandler(async (req, res, next) => {
  const { blog_id } = req.params;
  if (!blog_id) {
    throw new ApiError(200, "Blog ID is missing.");
  }

  const blog = await Blog.findById(blog_id)
    .populate("author", "name email")
    .populate("category", "name");
  console.log(blog);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        blog,
        blog ? "Blog retrieved sucessfully." : "Blog not found"
      )
    );
});

export const editBlog = asyncHandler(async (req, res, next) => {
  const { blog_id } = req.params;
  if (!blog_id) {
    throw new ApiError(200, "Blog ID is missing.");
  }
  const data = JSON.parse(req.body.data);
  const imagePath = req.file?.path;
  let uploadResult;
  if (imagePath) {
    uploadResult = await uploadOnCloudinary(imagePath);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    blog_id,
    {
      $set: {
        category: data.category,
        title: data.title,
        slug: data.slug,
        blogContent: encode(data.blogContent),
        author: data.author,
        ...(uploadResult && { featuredImage: uploadResult.secure_url }),
      },
    },
    { new: true }
  );
  console.log("Updated Blog\n", updatedBlog);

  res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, "Blog Updated Successfully."));
});

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

export const deleteBlog = asyncHandler(async (req, res, next) => {
  const { blog_id } = req.params;
  if (!blog_id) {
    throw new ApiError(404, "Blog ID is misssing.");
  }
  const deletedBlog = await Blog.findByIdAndDelete(blog_id);
  if (!deletedBlog) {
    throw new ApiError(404, "No blog found with the provided ID.");
  }

  console.log("🗑️ Deleted blog details:\n", deletedBlog);

  res.status(200).json(new ApiResponse(200, {}, "Blog deleted successfully."));
});
