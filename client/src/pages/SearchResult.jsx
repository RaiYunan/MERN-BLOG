import Loading from "@/components/Loading";

import React from "react";
import { useSearchParams } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { RouteBlogShow, RouteIndex } from "@/helpers/RouteName";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "Not found..";

  const url = `${import.meta.env.VITE_URL}/blog/search?q=${encodeURIComponent(
    q
  )}`;
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });
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
  console.log("SearchResult:\n", blogData);
  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex gap-2 text-violet-600">
        {blogData && blogData.length > 0 ? (
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-3 bg-white border border-violet-200 rounded-xl px-4 py-3 shadow-sm">
              <svg
                className="w-5 h-5 text-violet-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-violet-700 font-medium">
                Search Results for:
              </span>
              <span className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                "{q}"
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="w-full flex gap-4 pt-4">
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
                          {decodeHTML(blog?.blogContent).replace(
                            /<[^>]*>/g,
                            ""
                          )}
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
          // No Blogs State

          <div className="flex flex-col items-center justify-center w-full py-6 px-4 text-center">
            {/* Icon/Illustration */}
            <div className="w-24 h-24 mb-6 text-gray-300">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 13H9"
                />
              </svg>
            </div>

            {/* Message */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No results found for "{q}"
            </h3>

            <p className="text-gray-500 max-w-md mb-8">
              We couldn't find any blogs matching your search. Try adjusting
              your keywords or browse all blogs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Link to={RouteIndex}>Browse All Blogs</Link>
              </Button>

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Go Back
              </Button>
            </div>

            {/* Search Tips */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Search tips:
              </h4>
              <ul className="text-xs text-gray-600 text-left space-y-1">
                <li>• Try different keywords or synonyms</li>
                <li>• Check for spelling errors</li>
                <li>• Use more general terms</li>
                <li>• Search by category or author name</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
