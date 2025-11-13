import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import {
  RouteBlog,
  RouteBlogAdd,
  RouteBlogShow,
  RouteIndex,
} from "@/helpers/RouteName";

const BlogCardByCategory = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const url = `${import.meta.env.VITE_URL}/blog/${categorySlug}`;
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });
  console.log(blogData);
  if (loading) return <Loading />;

  const decodeHTML = (htmlString) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = htmlString;
    return textarea.value;
  };
  // Get initials for avatar fallback
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };
  return (
  <div className="w-full flex flex-wrap gap-4 justify-center md:justify-start">
    {blogData.length > 0 ? (
      blogData.map((blog) => {
        return (
          <Link
            to={RouteBlogShow(blog?.category.slug, blog?.slug)}
            key={blog._id}
          >
            <Card className="w-[300px] rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white border-0 overflow-hidden group py-0">
              <CardContent className="p-0 cursor-pointer h-full flex flex-col">
                {/* Image container with gradient overlay */}
                <div className="overflow-hidden relative">
                  <img
                    src={blog?.featuredImage}
                    alt={blog?.title}
                    className="h-[180px] w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category badge positioned on image */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {blog?.category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Author info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={blog?.author.avatar}
                        alt={blog?.author.name}
                        className="object-cover rounded-full"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                        {getInitials(blog?.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {blog?.author.name}
                      </h3>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors">
                    {blog?.title}
                  </h3>

                  {/* Description */}
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {decodeHTML(blog?.blogContent).replace(/<[^>]*>/g, "")}
                    </p>
                  </div>

                  {/* Read more indicator */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-purple-600 font-medium group-hover:underline">
                      Read more
                    </span>
                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })
    ) : (
      // No Blogs State (same as before)
      <div className="flex flex-col items-center justify-center w-full py-6 px-4 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No blogs found in this category
        </h3>

        <p className="text-gray-500 mb-6 max-w-md">
          {categorySlug
            ? `There are no blogs available in the "${categorySlug}" category yet. Check back soon or explore other categories!`
            : "No blogs are available at the moment. Please check back later!"}
        </p>

        <div className="flex gap-3">
          <Button
            asChild
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white"
          >
            <Link>Go Back</Link>
          </Button>

          <Button
            asChild
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Link to={RouteIndex}>Browse All Categories</Link>
          </Button>
        </div>
      </div>
    )}
  </div>
);
};

export default BlogCardByCategory;
