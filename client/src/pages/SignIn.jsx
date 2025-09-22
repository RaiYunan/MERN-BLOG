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
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Link,useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignUp } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";



const SignIn = () => {
  const navigate=useNavigate()
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password msut be at least 8 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const url=`${import.meta.env.VITE_URL}/login`
      const response=await fetch(url,
        {
          method:"POST",
          headers:{"Content-type":"application/json"},
          body:JSON.stringify(values),
        }
      )

      console.log(response);
      if(!response.ok){
        console.log("Error while logging in")
        showToast("error","Error while logging in.")
      }

      const data=await response.json();
      console.log(data);
      showToast("success","User logged in sucessfully")
      navigate(RouteIndex);
      
      
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="w-[400px] p-5">
        <h1 className="text-2xl font-bold text-center mb-5">
          Sign in to your account
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="flex gap-2 text-sm justify-center items-center my-5">
                <p>Don't have an account?</p>
                <Link
                  className="text-blue-600 hover:underline"
                  to={RouteSignUp}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
