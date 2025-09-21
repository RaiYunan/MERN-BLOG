import React from 'react'
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
import { Link,useNavigate } from "react-router-dom";
import { RouteSignIn} from '@/helpers/RouteName';
import { showToast } from '@/helpers/showToast';



const SignUp = () => {
  const navigate=useNavigate();

  const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long.").max(100,"Name must be less than 100 characters long."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
      confirmPassword:""
    },
  });

  async function onSubmit(values) {
    const {confirmPassword,...userData}=values
    try {
      const url=`${import.meta.env.VITE_URL}/register`
      const response=await fetch(url,{
       method:"POST",
       headers:{"Content-type":"application/json"},
       body:JSON.stringify(userData)
      });

      const data=await response.json();

      if(!response.ok){
        showToast("error",data.message)
        return;
      }
      console.log(data);
      navigate(RouteSignIn);
      showToast("success",data.message);

      
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong. Try again.");
    }
  }


  return (
   <div className="flex items-center justify-center h-screen w-screen">
      <Card className="w-[400px] p-5">
        <h1 className="text-2xl font-bold text-center mb-5">
          Create your account
        </h1>
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
                      <Input type="password" placeholder="Enter your password" {...field} />
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
                      <Input type="password" placeholder="Enter your password again" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="flex gap-2 text-sm justify-center items-center my-5">
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
  )
}

export default SignUp
