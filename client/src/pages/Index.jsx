import React from "react";
import BlogCard from "@/components/BlogCard";
import { useFetch } from "@/hooks/useFetch";
import { Link } from "react-router-dom";
import { RouteBlogShow } from "@/helpers/RouteName";
import userImage from "../assets/images/download.png";
const Index = () => {
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(`${import.meta.env.VITE_URL}/blog/all-blogs`);

  console.log("BLogData\n", blogData);

  if (loading)
    return <p className="text-center text-gray-500">Loading blogs...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading blogs!</p>;

  return (
    <div className="flex flex-wrap gap-5 justify-center bg-gray-50 min-h-screen ">
      {blogData?.length > 0 ? (
        blogData.map((blog) => (
          <Link
            to={RouteBlogShow(blog?.category?.slug, blog?.slug)}
            key={blog._id}
          >
            <BlogCard
              key={blog._id}
              featuredImage={blog.featuredImage}
              blogContent={blog.blogContent}
              title={blog.title}
              category={blog.category.name || "General"}
              avatar={blog.author?.avatar || userImage}
              name={blog.author?.name || "Unknown User"}
            />
          </Link>
        ))
      ) : (
        <p className="text-gray-500 text-lg">No blogs available</p>
      )}
    </div>
  );
};

export default Index;
