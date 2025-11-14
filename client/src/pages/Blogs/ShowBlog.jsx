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
    <div className="flex flex-col lg:flex-row gap-6 justify-between max-w-full sm:px-6 md:px-10 lg:px-0">
      {/* Main Blog Section */}
      <Card className="flex-[0.65] w-full rounded-md text-center">
        <CardHeader>
          <p className="text-violet-600 text-sm sm:text-base">
            Published on{" "}
            {new Date(blogData?.blog?.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>

          <div className="font-bold text-2xl sm:text-3xl my-2 leading-tight">
            {blogData?.blog?.title}
          </div>

          <div>
            <span className="text-xs sm:text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {blogData?.blog?.author?.name}
            </span>
          </div>

          {/* Like & Comment Section */}
          <div className="flex justify-center sm:justify-start gap-4 mt-2">
            <div className="flex items-center gap-1 cursor-pointer">
              <button onClick={handleLike} className="cursor-pointer">
                {isLiked ? (
                  <FcLike size={18} />
                ) : (
                  <FaRegHeart
                    size={18}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  />
                )}
              </button>
              <span className="text-sm text-gray-600">{likeCount}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-600">
              <FaRegComment size={18} />
              <p className="text-sm">{blogData?.blog.commentCount}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <img
              src={blogData?.blog?.featuredImage}
              alt=""
              className="w-full rounded-md object-cover max-h-[400px]"
            />
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: decode(blogData?.blog?.blogContent),
            }}
            className="text-left px-2 sm:px-4 text-[14px] leading-relaxed"
          ></div>

          <div className="border-t my-6"></div>

          <Comment
            blogId={blogData?.blog._id}
            authorId={user?.user._id || user.user?.data?._id}
          />
        </CardContent>
      </Card>

      {/* Sidebar Section */}
      <Card className="flex-[0.35] w-full lg:w-[380px] max-h-fit rounded-xl shadow-sm border-0 sticky top-4">
        <CardHeader className="font-bold text-xl sm:text-2xl text-gray-900 pb-2 border-b border-gray-100">
          You Might Also Like
        </CardHeader>

        <CardContent className="px-2 sm:px-4 space-y-4">
          {blogData?.relatedBlogs.length > 0 ? (
            blogData.relatedBlogs.map((relatedBlog) => (
              <div
                key={relatedBlog._id}
                className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200"
                onClick={() => handleBlogClick(relatedBlog.slug)}
              >
                <div className="flex-[0.3]">
                  <img
                    src={relatedBlog.featuredImage}
                    alt={relatedBlog.title}
                    className="w-full h-[60px] object-cover rounded-md"
                  />
                </div>

                <div className="flex-[0.7] min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors leading-tight">
                    {relatedBlog.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="truncate">{relatedBlog.author?.name}</span>
                    <span>•</span>
                    <span>
                      {new Date(relatedBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              No related blogs found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowBlog;
