import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignIn } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";
import GoogleLogin from "@/components/GoogleLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const navigate = useNavigate();

  const formSchema = z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters long.")
        .max(100, "Name must be less than 100 characters long."),
      email: z.string().email("Please enter a valid email address."),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    const { confirmPassword, ...userData } = values;
    try {
      const url = `${import.meta.env.VITE_URL}/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      console.log(data);
      navigate(RouteSignIn);
      showToast("success", data.message);
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong. Try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen pt-6">
      <Card className="w-[400px] p-5 ">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 cursor-pointer"
          onClick={() => navigate(RouteIndex)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-center">Create your account</h1>
        <div className="">
          <GoogleLogin />
          <div className="border flex justify-center items-center mt-5">
            <span className="absolute bg-white text-sm ">Or</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword.new ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 tansition-colors cursor-pointer"
                        >
                          {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword.confirm ? "text" : "password"}
                          placeholder="Enter your password again"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 tansition-colors cursor-pointer"
                        >
                          {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-3">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="flex gap-1 text-sm justify-center items-center my-3">
                <p>Already have an account?</p>
                <Link
                  className="text-blue-600 hover:underline"
                  to={RouteSignIn}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
