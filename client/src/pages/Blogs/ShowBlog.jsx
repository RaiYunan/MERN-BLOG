import Comment from "@/components/Comment";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { decode } from "entities";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa6";
import { showToast } from "@/helpers/showToast";

const ShowBlog = () => {
  const { categorySlug, blogSlug } = useParams();
  const user = useSelector((state) => state.user);
  const [isLiked, setisLiked] = useState(false);
  const [refreshData, setRefreshdata] = useState(false);

  const url = `${import.meta.env.VITE_URL}/blog/${categorySlug}/${blogSlug}`;
  const {
    data: blogData,
    loading: blogLoading,
    error: blogError,
  } = useFetch(
    url,
    {
      method: "GET",
      credentials: "include",
    },
    [refreshData]
  );

  useEffect(()=>{
    if(blogData?.blog){

    }
  })

  async function handleLike() {
    const blogId = blogData?.blog._id;
    const authorId = user?.user._id || user?.user?.data._id;
    const dataToSend = { blogId, authorId };

    if (!isLiked) {
      try {
        const url = `${
          import.meta.env.VITE_URL
        }/blog/${categorySlug}/${blogSlug}/add-like`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(dataToSend),
        });
        const responseData = await response.json();
        console.log("responseData after like", responseData);
        if (!response.ok) {
          showToast("success", responseData.message);
          return;
        }
        setRefreshdata((prev) => !prev);
      } catch (error) {
        showToast("error", error.message);
        console.log("Error while handling likes\n", error.message);
      }
    } else {
      const url = `${
        import.meta.env.VITE_URL
      }/blog/${categorySlug}/${blogSlug}/remove-like`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(dataToSend),
        });
        const responseData = await response.json();
        console.log("responseData after unlike", responseData);
        if (!response.ok) {
          showToast("success", responseData.message);
          return;
        }
        setRefreshdata((prev) => !prev);
      } catch (error) {
        showToast("error", error.message);
      }
    }
    setisLiked((prev) => !prev);
  }
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
                <span className="text-[14px] text-gray-600">
                  {blogData?.blog?.likeCount}
                </span>
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
      <Card className="flex-[0.4] min-w-0 w-[350px] rounded-md max-h-fit gap-2 m-0 fixed right-[15px] ">
        <CardHeader className="font-semibold text-xl">Related Blogs</CardHeader>
        <CardContent className="cursor-pointer">
          {blogData?.relatedBlogs.length > 0 ? (
            blogData.relatedBlogs.map((relatedBlog) => {
              return (
                <div className="flex gap-2 mt-3 items-center">
                  <img
                    src={relatedBlog?.featuredImage}
                    alt=""
                    className="flex-[0.35] min-w-0 h-[50px]"
                  />
                  <p className="flex-[0.65] min-w-0 text-sm">
                    {relatedBlog?.title}
                  </p>
                </div>
              );
            })
          ) : (
            <p>No related Blogs are found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowBlog;
