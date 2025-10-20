import Comment from "@/components/Comment";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { decode } from "entities";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa6";
import { showToast } from "@/helpers/showToast";
import { RouteBlogShow } from "@/helpers/RouteName";

const ShowBlog = () => {
  const { categorySlug, blogSlug } = useParams();
  const user = useSelector((state) => state.user);
  console.log("USer details", user);
  const [isLiked, setisLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

  const url = `${import.meta.env.VITE_URL}/blog/${categorySlug}/${blogSlug}`;
  const {
    data: blogData,
    loading: blogLoading,
    error: blogError,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  console.log("BLogData", blogData);
  useEffect(() => {
    if (blogData?.blog) {
      setLikeCount(blogData.blog.likeCount);
      const userId = user?.user?._id || user?.user?.data?._id;
      const hasUserLiked = blogData.blog.likes?.some(
        (like) => like.author?.toString() === userId
      );
      setisLiked(hasUserLiked);
    }
  }, [blogData, user]);

  async function handleLike() {
    if (!user.isLoggedIn) {
      showToast(
        "error",
        "You must be **logged in** to like this. Please sign in or create an account."
      );
      return;
    }
    const blogId = blogData?.blog._id;
    const authorId = user?.user._id || user?.user?.data._id;
    const dataToSend = { blogId, authorId };

    setisLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      const url = `${
        import.meta.env.VITE_URL
      }/blog/${categorySlug}/${blogSlug}/${
        isLiked ? "remove-like" : "add-like"
      }`;
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();
      console.log(responseData);
      showToast("success", responseData.message);
      if (!response.ok) {
        setisLiked((prev) => !prev);
        setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
        showToast("error", responseData.message);
      }
    } catch (error) {
      setisLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      showToast("error", "Something went wrong while liking the post");
      console.error(error);
    }
  }

  const handleBlogClick = (newBlogSlug) => {
    navigate(RouteBlogShow(categorySlug, newBlogSlug), { replace: true });
  };
  if (blogLoading) return <Loading />;
  return (
    <div className="flex gap-4 justify-between max-w-full">
      <Card className="flex-[0.63] min-w-0 rounded-md text-center">
        <CardHeader className="">
          <p className="text-violet-600">
            Published on{" "}
            {new Date(blogData?.blog?.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <div className="font-bold text-3xl my-2">{blogData?.blog?.title}</div>
          <div>
            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {blogData?.blog?.author?.name}
            </span>
          </div>
          <div className="flex gap-4">
            {/*Like and Comment Section*/}
            <div className="flex items-center cursor-pointer">
              <span className="flex items-center gap-1">
                <button className="p-0 cursor-pointer" onClick={handleLike}>
                  {isLiked ? (
                    <FcLike size="16" />
                  ) : (
                    <FaRegHeart
                      size="16"
                      className=" text-gray-600 hover:text-red-400 transition-colors"
                    />
                  )}
                </button>
                <span className="text-[14px] text-gray-600">{likeCount}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-600 ">
              <button className="cursor-pointer">
                <FaRegComment />
              </button>
              <p className="text-[14px] cursor-pointer">
                {blogData?.blog.commentCount}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <img
              src={blogData?.blog?.featuredImage}
              alt=""
              className="w-full rounded-md"
            />
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: decode(blogData?.blog?.blogContent),
            }}
            className="text-left px-8"
          ></div>
          <div>
            {/* Separartor */}
            <div className="border flex justify-center items-center mt-5">
              <span className="absolute bg-white text-sm "></span>
            </div>
            {/* Comment Section */}
            <div>
              <Comment
                blogId={blogData?.blog._id}
                authorId={user?.user._id || user.user?.data?._id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-[0.4] min-w-0 w-[380px] max-h-fit rounded-xl shadow-sm border-0 sticky top-4">
        <CardHeader className="font-bold text-2xl text-gray-900 pb-0 border-b border-gray-100">
          You Might Also Like
        </CardHeader>
        <CardContent className="px-4 space-y-4">
          {blogData?.relatedBlogs.length > 0 ? (
            blogData.relatedBlogs.map((relatedBlog) => (
              <div
                key={relatedBlog._id}
                className="flex gap-3 p-3 mb-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-gray-200"
                onClick={() => handleBlogClick(relatedBlog.slug)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleBlogClick(relatedBlog.slug)
                }
                tabIndex={0}
                role="button"
                aria-label={`Read ${relatedBlog.title}`}
              >
                {/* Image with better styling */}
                <div className="flex-[0.3] min-w-0">
                  <img
                    src={relatedBlog?.featuredImage}
                    alt={relatedBlog?.title}
                    className="w-full h-[60px] object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Content */}
                <div className="flex-[0.7] min-w-0 space-y-1">
                  {/* Title */}
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
                    {relatedBlog?.title}
                  </p>

                  {/* Author and date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="truncate">{relatedBlog.author?.name}</span>
                    <span>•</span>
                    <span>
                      {new Date(relatedBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Hover arrow indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No related blogs found</p>
              <p className="text-gray-400 text-xs mt-1">
                Check back later for more content
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowBlog;
