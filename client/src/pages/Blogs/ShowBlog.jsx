import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { decode } from "entities";
import React from "react";
import { useParams } from "react-router-dom";

const ShowBlog = () => {
  const { category, slug } = useParams();

  const url = `${import.meta.env.VITE_URL}/blog/${category}/${slug}`;
  const {
    data: blogData,
    loading: bloogLoading,
    error: blogError,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  console.log("blogData\n", blogData);
  if (bloogLoading) return <Loading />;
  return (
    <div className="flex gap-4 justify-between max-w-full">
      <Card className="flex-[0.6] min-w-0 rounded-md text-center">
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
            className="text-left"
          ></div>
        </CardContent>
      </Card>
      <Card className="flex-[0.4] min-w-0 w-[350px] rounded-md max-h-fit gap-2 m-0 fixed right-[30px]">
        <CardHeader className='font-semibold text-xl'>Related Blogs</CardHeader>
        <CardContent>
          {blogData?.relatedBlogs.length > 0 ? (
            blogData.relatedBlogs.map((relatedBlog) => {
              return (
                <div className="flex gap-2 mt-3 items-center">
                  <img src={relatedBlog?.featuredImage} alt="" className="flex-[0.35] min-w-0 h-[50px]" />
                  <p className="flex-[0.65] min-w-0 text-sm">{relatedBlog?.title}</p>
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
