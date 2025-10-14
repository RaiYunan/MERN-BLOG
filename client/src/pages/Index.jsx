import React from "react";
import BlogCard from "@/components/BlogCard";
import { useFetch } from "@/hooks/useFetch";
import { Link } from "react-router-dom";
import { RouteBlogShow } from "@/helpers/RouteName";

const Index = () => {
  const { data: blogData, loading, error } = useFetch(
    `${import.meta.env.VITE_URL}/blog/all-blogs`
  );

  if (loading) return <p className="text-center text-gray-500">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500">Error loading blogs!</p>;

  return (
    <div className="flex flex-wrap gap-6 p-6 bg-gray-50 min-h-screen">
      {blogData?.length > 0 ? (
        blogData.map((blog) => (
          <Link to={RouteBlogShow(blog._id)} key={blog._id}>
          <BlogCard
            key={blog._id}
            featuredImage={blog.featuredImage}
            blogContent={blog.blogContent}
            title={blog.title}
            category={blog.category.name || "General"}
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
