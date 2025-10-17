import React, { useEffect, useState } from "react";
import { FaComments } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import userImage from "../assets/images/download.png";
import { formatDistanceToNow } from "date-fns";

import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showToast } from "@/helpers/showToast";
import { useParams } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { GoDotFill } from "react-icons/go";

const Comment = ({ blogId, authorId }) => {
  const { categorySlug, blogSlug } = useParams();
  const [refreshData, setRefreshData] = useState(false);
  const url = `${
    import.meta.env.VITE_URL
  }/blog/${categorySlug}/${blogSlug}/comments`;
  const {
    data: CommentsData,
    loading,
    error,
  } = useFetch(
    url,
    {
      method: "GET",
      credentials: "include",
    },
    [refreshData]
  );
  console.log("Comments data:-", CommentsData);

  const formSchema = z.object({
    comment: z.string().min(1, "Comment must be atleast 1 character"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  const commentContent = form.watch("comment");

  async function onSubmit(values) {
    const dataToSend = { ...values, blogId, authorId };
    console.log(dataToSend);
    try {
      const url = `${
        import.meta.env.VITE_URL
      }/blog/${categorySlug}/${blogSlug}/comment`;

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const responseData = await response.json();
      if (!response.ok) {
        showToast("error", responseData.message);
        return;
      }
      showToast("success", responseData.message);
      console.log(responseData);
      form.reset();
      setRefreshData((prev) => !prev);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  const getRedditStyleTime = (createdAt) => {
    const now = new Date();
    const commentDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return commentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };
  return (
    <div className="flex flex-col gap-6 px-2 py-4">
      {/* Header */}
      <div className="flex gap-3 items-center">
        <FaComments className="text-violet-500 text-2xl" />
        <h3 className="font-bold text-xl">
          Comments ({CommentsData?.length || 0})
        </h3>
      </div>

      {/* Comment Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Join the conversation
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts, ask a question, or add to the discussion..."
                    className="min-h-[80px] resize-vertical text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="px-6 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-colors block text-left"
            disabled={commentContent.trim() === ""}
          >
            Comment
          </Button>
        </form>
      </Form>

      {/* Comments List */}
      <div className="space-y-6">
        {CommentsData?.length > 0 ? (
          CommentsData.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              {/* Comment Header */}
              <div className="flex items-center gap-3 mb-0">
                <Avatar className="w-10 h-10 ">
                  <AvatarImage
                    src={comment.author.avatar || userImage}
                    alt={comment.author.name}
                    className="object-cover"
                  />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {comment.author.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center">
                      <GoDotFill className="mx-1" />
                      {getRedditStyleTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <div className="text-gray-800 text-base leading-relaxed pl-12 text-left">
                {comment.content}
              </div>

              {/* Comment Actions */}
              <div className="flex gap-4 mt-3 pl-12">
                <button className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
                  👍 Like
                </button>
                <button className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
                  💬 Reply
                </button>
              </div>
              {/* Separartor */}
              <div className="border flex justify-center items-center mt-5">
                <span className="absolute bg-white text-sm "></span>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FaComments className="text-gray-300 text-4xl mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No comments yet
            </h3>
            <p className="text-gray-500 text-base">
              Be the first to share your thoughts and start the conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
