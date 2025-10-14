import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const BlogCard = ({ featuredImage, category, title, blogContent }) => {
  const decodeHTML = (htmlString) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = htmlString;
    return textarea.value;
  };
  return (
    <Card className="w-[260px] rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-white pt-0">
      <CardContent className="p-0 cursor-pointer">
        {/* Image container for zoom effect */}
        <div className="overflow-hidden rounded-t-lg p-0">
          <img
            src={featuredImage}
            alt={title}
            className="h-[160px] w-full object-cover transform transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category badge */}
          <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            {category}
          </span>

          {/* Title */}
          <h3 className="mt-4 text-md font-semibold line-clamp-2 text-gray-900">
            {title}
          </h3>

          {/* Description */}
          <div
            className="text-gray-600 text-sm mt-1 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: decodeHTML(blogContent) }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
