import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { encode } from "entities";
import { Category } from "../models/category.model.js";

export const getAllBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find()
    .populate("author", "name email avatar")
    .populate("category", "name slug")
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
  const { blogSlug } = req.params;

  const blog = await Blog.findOne({ slug: blogSlug }).populate({
      path:"likes",
      select:"author"
    })
    .populate("author", "email name")
    .populate("category", "name slug");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (!blog.category) {
    throw new ApiError(404, "Blog category not found");
  }
  const relatedBlogs = await Blog.find({
    category: blog.category._id,
    _id: { $ne: blog._id },
  })
    .populate("category", "name slug")
    .populate("author", "name")
    .select("title slug featuredImage category author createdAt")
    .limit(5)
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { blog, relatedBlogs },
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
    .populate("category", "name slug");

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

  res.status(200).json(new ApiResponse(200, {}, "Blog deleted successfully."));
});

export const getBlogByCategory=asyncHandler(async(req,res,next)=>{
  const {categorySlug}=req.params;
  if(!categorySlug){
    throw new ApiError(404,"Category Slug is required!!");
  }

  const category=await Category.findOne({
    slug:categorySlug
  })
  const blogs=await Blog.find({category:category._id}).populate({
    path:"author",
    select:"name avatar"
  }).populate({
    path:"category",
    select:"name slug"
  })
  if(!blogs){
    throw new ApiError(404,"No blogs in this category!!");

  }

  res.status(200).json(new ApiResponse(404,blogs,"Blogs retrieved successfully."))
})
