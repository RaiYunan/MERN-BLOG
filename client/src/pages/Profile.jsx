import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { RouteSignUp } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '@/helpers/showToast';
import userImage from "../assets/images/download.png"
import { Textarea } from "@/components/ui/textarea"


const Profile = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const user=useSelector((state)=>state.user)
    console.log(user);
     const formSchema = z.object({
        name: z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name cannot exceed 50 characters"),
        email: z.string()
        .email("Please enter a valid email address"),
        bio: z.string()
        .min(5, "Bio must be at least 5 characters long")
        .max(160, "Bio cannot exceed 160 characters"),
        password: z.string()
        .min(8, "Password must be at least 8 characters long")
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
          email: "",
          bio:"",
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
                  credentials:"include",
                  body:JSON.stringify(values),
                }
              )
        
              const data=await response.json();
        
              console.log(response);
              if(!response.ok){
                console.log("Error while logging in",data)
                showToast("error",data.message);
                return;
              }
              console.log("before dispatch",data)
              dispatch(setUser(data))
              navigate(RouteIndex);
              showToast("success","User logged in sucessfully")
              
            } catch (error) {
              showToast("error",error.message)
            } 
        
    }
   
  return (
    <Card className=" max-w-screen-md mx-auto px-15">
    <CardContent>
              <div className='flex justify-center items-center mt-5'>
            <Avatar className="w-28 h-28">
             <AvatarImage src={user.user.avatar || userImage} />
            </Avatar>
        </div>

        
        <div>
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
             <div className="mb-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Name"
                        {...field}
                        value={user.user.name || user.user.data.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-5">
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
                         value={user.user.email || user.user.data.email}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

             <div className="mb-5">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5">
              <Button type="submit" className="w-full">
                Save Changes
              </Button>

            </div>
          </form>
        </Form>
        </div>
    </CardContent>
    </Card>
  )
}

export default Profile
