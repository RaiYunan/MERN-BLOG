import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RouteIndex, RouteSignIn } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";
import { Button } from "@/components/ui/button";
import slugify from "slugify";

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formSchema = z.object({
    name: z.string().min(3, "Name must be atleast 3 characters"),
    slug: z.string().min(3, "Slug must be atleast 3 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue.trim()) {
      const generatedSlug = slugify(nameValue, {
        trim: true,
        strict: true, //removes ALL special characters except letters, numbers, and hyphens.
        lower: true,
      });
      form.setValue("slug", generatedSlug);
    }
  }, [nameValue, form]);

  async function onSubmit(values) {
    console.log(values);
    try {
      const url = `${import.meta.env.VITE_URL}/category/add-category`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const responseData = await response.json();
      if (!response.ok) {
        showToast("error", responseData.message);
        return;
      }
      form.reset({
        name: "",
        slug: "",
      });
      showToast("success", responseData.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div className="pt-5 max-w-screen-md mx-auto">
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-5 px-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Category Name" {...field} />
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

              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
