import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Dropzone from "react-dropzone";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import Editor from "@/components/Editor";

const AddBlog = () => {
  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState(null);
  const url = `${import.meta.env.VITE_URL}/category/all-category`;
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  const formSchema = z.object({
    category: z.string().min(3, "Category must be at least 3 characters."),
    title: z.string().min(3, "Title must be at least 3 characters."),
    slug: z.string(),
    blogContent: z
      .string()
      .min(3, "Blog content must be at least 3 characters."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const titleValue = form.watch("title");
  useEffect(() => {
    if (titleValue.trim()) {
      const generatedSlug = slugify(titleValue, {
        trim: true,
        lower: true,
        strict: true,
      });
      form.setValue("slug", generatedSlug);
    } else {
      form.setValue("slug", "");
    }
  }, [titleValue]);

  async function onSubmit(values) {
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }

    const dataToSend = JSON.stringify(values);
    formData.append("data",dataToSend)
    console.log("lauda")

    const url=`${import.meta.env.VITE_URL}/blog/add-blog`;
    try {
      console.log("lund")
      const response=await fetch(url,{
        method:"POST",
        credentials:"include",
        body:formData
      })
      console.log(response)

      const responseData=await response.json()
      console.log(responseData)
    } catch (error) {
      console.log(error.message)
      
    }
  }
  function handleFileSelection(files) {
    const selectedFile = files[0];

    if (!selectedFile) return;
    const preview = URL.createObjectURL(selectedFile);
    setFilePreview(preview);
    console.log(preview);
    console.log(selectedFile);
    setFile(selectedFile);
  }

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
        console.log("Preview Removed", filePreview);
      }
    };
  }, [filePreview]);

  function handleEditorData(event, editor) {
    const data = editor.getData();
    form.setValue("blogContent", data);
  }
  if (loading) return <Loading />;

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-5 px-5">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData &&
                            categoryData.length > 0 &&
                            categoryData.map((category) => {
                              return (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-5 px-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-5 px-5">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-5 px-5">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Upload a Featured Image
              </span>
              <Dropzone
                onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div
                      {...getRootProps()}
                      className="flex flex-col items-center justify-center w-[400px] h-[250px] border-2 border-dashed border-gray-400  cursor-pointer hover:border-blue-500 transition-colors duration-300 ease-in-out"
                    >
                      <input {...getInputProps()} />
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span>Drag & drop or click to upload</span>
                      )}
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>

            <div className="my-10">
              <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter Title" {...field} /> */}
                      <Editor initialData="" onChange={handleEditorData} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddBlog;
