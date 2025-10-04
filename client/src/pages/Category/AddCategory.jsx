import { Card } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import z from 'zod';
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

const AddCategory = () => {
     const dispatch=useDispatch()
      const navigate=useNavigate()
      const formSchema = z.object({
        name:z.string().min(3,"Name must be atleast 3 characters"),
        slug:z.string().min(3,"Slug must be atleast 3 characters"),
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          slug: "",
        },
      });
    
      async function onSubmit(values) {
        // try {
        //   const url=`${import.meta.env.VITE_URL}/auth/login`
        //   const response=await fetch(url,
        //     {
        //       method:"POST",
        //       headers:{"Content-type":"application/json"},
        //       credentials:"include",
        //       body:JSON.stringify(values),
        //     }
        //   )
    
        //   const data=await response.json();
    
        //   console.log(response);
        //   if(!response.ok){
        //     console.log("Error while logging in",data)
        //     showToast("error",data.message);
        //     return;
        //   }
        //   console.log("before dispatch",data)
        //   dispatch(setUser(data))
        //   navigate(RouteIndex);
        //   showToast("success","User logged in sucessfully")
          
        // } catch (error) {
        //   showToast("error",error.message)
        // }
      }
    
  return (
    <div className="flex w-full items-center justify-center">
      <Card className="w-[400px] p-5 ">
        <h1 className="text-2xl font-bold text-center">
          Add Category
        </h1>
        <div className=''>
          <div className='border flex justify-center items-center mt-5'>
            <span className='absolute bg-white text-sm '>Or</span>
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
                      <Input placeholder="Enter Category Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Slug"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

             <Button type="submit" className="w-full">
                            Submit
             </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default AddCategory
