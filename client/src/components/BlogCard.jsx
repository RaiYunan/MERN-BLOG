import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const BlogCard = ({
  featuredImage,
  category,
  title,
  blogContent,
  avatar,
  name,
}) => {
  const decodeHTML = (htmlString) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = htmlString;
    return textarea.value;
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <Card className="w-[300px] rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white border-0 overflow-hidden group py-0">
      <CardContent className="p-0 cursor-pointer h-full flex flex-col">
        {/* Image container with gradient overlay */}
        <div className="overflow-hidden relative">
          <img
            src={featuredImage}
            alt={title}
            className="h-[180px] w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category badge positioned on image */}
          <div className="absolute top-3 left-3">
            <span className="text-xs font-semibold text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Author info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
              <AvatarImage
                src={avatar}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {name}
              </h3>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <div className="flex-1">
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {decodeHTML(blogContent).replace(/<[^>]*>/g, '')}
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
  );
};

export default BlogCard;