import React, { useEffect } from "react";
import { FaComments } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

const Comment = ({ blogId, authorId }) => {
  const { categorySlug, blogSlug } = useParams();
  const url = `${import.meta.env.VITE_URL}/blog/${categorySlug}/${blogSlug}/comments`;
  const {
    data: CommentsData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });
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
    } catch (error) {
      showToast("error", error.message);
    }
  }
  return (
    <div className="flex flex-col gap-4 px-2 py-3 text-xl">
      <div className="flex gap-3 items-center">
        <FaComments className="text-violet-500" />
        <h3 className="font-bold">Comments(0)</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-3 px-5">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-semibold">
                    Add your Comment
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your comment here.."
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex pl-5">
            <Button
              type="submit"
              className="cursor-pointer max-w-fit rounded "
              disabled={commentContent.trim() == ""}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>

      {/*Comment Section*/}
    </div>
  );
};

export default Comment;
