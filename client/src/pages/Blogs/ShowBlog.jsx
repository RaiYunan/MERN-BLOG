import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { useParams } from "react-router-dom";

const ShowBlog = () => {
    const {blogID}=useParams();

    const url=`${import.meta.env.VITE_URL}/blog/show-blog/${blogID}`;
    const {data:blogData,loading,error}=useFetch(url,{
        method:"GET",
        credentials:"include"
    })

    console.log("blogData'\n",blogData)
  return <div>
    <Card>
        <CardHeader>
            {blogData.title}

        </CardHeader>
        <CardContent>

        </CardContent>
    </Card>
     <Card>
        <CardHeader>
            Related Blogs

        </CardHeader>
        <CardContent>
            
        </CardContent>
    </Card>
  </div>;
};

export default ShowBlog;
