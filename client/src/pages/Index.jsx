import React from "react";
import BlogCard from "@/components/BlogCard";
import { useFetch } from "@/hooks/useFetch";
import { Link } from "react-router-dom";
import { RouteBlogShow } from "@/helpers/RouteName";

const Index = () => {
  const { data: blogData, loading, error } = useFetch(
    `${import.meta.env.VITE_URL}/blog/all-blogs`
  );

  console.log("BLogData\n",blogData)

  if (loading) return <p className="text-center text-gray-500">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500">Error loading blogs!</p>;

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 bg-gray-50 min-h-screen">
    {blogData?.length > 0 ? (
      blogData.map((blog) => (
        <Link
          to={RouteBlogShow(blog?.category?.slug, blog?.slug)}
          key={blog._id}
        >
          <BlogCard
            featuredImage={blog.featuredImage}
            blogContent={blog.blogContent}
            title={blog.title}
            category={blog.category?.name || "General"}
            avatar={blog.author?.avatar}
            name={blog.author?.name}
          />
        </Link>
      ))
    ) : (
      <p className="text-gray-500 text-lg text-center col-span-full">
        No blogs available
      </p>
    )}
  </div>
);

};

export default Index;
