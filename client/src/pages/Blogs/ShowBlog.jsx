import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { useParams } from "react-router-dom";

const ShowBlog = () => {
  const { category,slug } = useParams();

  const url = `${import.meta.env.VITE_URL}/blog/${category}/${slug}`;
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  console.log("blogData\n", blogData);
  return (
    <div className="flex gap-4 justify-between max-w-full">
      <Card className="flex-[0.7] min-w-0 rounded-md text-center">
        <CardHeader className="">
          <p className="text-violet-600">
            Published on{" "}
            {new Date(blogData?.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <div className="font-medium text-2xl">{blogData?.title}</div>
          <div><span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            {blogData?.author?.name}
          </span></div>
        </CardHeader>
        <CardContent>
            <div className=""><img src={blogData?.featuredImage} alt="" className="w-full rounded-md"/></div>
        </CardContent>
      </Card>
      <Card className="flex-[0.3] min-w-0 rounded-md">
        <CardHeader>Related Blogs</CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default ShowBlog;
