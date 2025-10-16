import React from "react";
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

const Comment = () => {
  const formSchema = z.object({
    comment: z.string().min(1, "Comment must be atleast 1 character"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
     comment:""
    },
  });

  function onSubmit(values) {
    console.log(values);
    showToast("success","Comment added successfully");
    form.reset();
  }
  return (
    <div className="flex flex-col gap-4 px-2 py-3 text-xl">
      <div className="flex gap-3 items-center">
        <FaComments className="text-violet-500" />
        <h3 className="font-bold">Comments(0)</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 px-5">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[16px] font-semibold'>Add your Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Comment" className='' {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex pl-5">
            <Button type="submit" className="cursor-pointer max-w-fit rounded ">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Comment;
