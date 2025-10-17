import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignUp } from "@/helpers/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/helpers/showToast";
import userImage from "../assets/images/download.png";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch.js";
import Loading from "@/components/Loading";
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from "react-dropzone";
import { setUser } from "@/redux/user/user.slice";

const Profile = () => {
  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  const user = useSelector((state) => state.user);
  const userId = user?.user?.data?._id || user?.user?._id;
  const {
    data: userData,
    loading,
    error,
  } = useFetch(
    userId ? `${import.meta.env.VITE_URL}/users/get-user/${userId}` : null,
    {
      method: "GET",
      credentials: "include",
    },
    []
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name cannot exceed 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    bio: z
      .string()
      .min(5, "Bio must be at least 5 characters long")
      .max(160, "Bio cannot exceed 160 characters"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  console.log("User without google login",userData)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData?.name || "",
        email: userData?.email || "",
        bio: userData?.bio || "",
        password: "",
      });
    }
  }, [userData]);

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("avatar", file);
      }
      const dataToSend = JSON.stringify(values);
      formData.append("data", dataToSend);

      console.log("File in frontend:", file);
      console.log("data in frontend:", dataToSend);

      const url = `${import.meta.env.VITE_URL}/users/update-user/${
        userData?._id
      }`;
      const response = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const reponseData = await response.json();
      //need to work from here
      if (!response.ok) {
        console.log("Error while updating user details", reponseData);
        showToast("error", reponseData.message);
        return;
      }

      setFile(null);
      setFilePreview(null);

      dispatch(setUser(reponseData.data));
      navigate(RouteIndex, { replace: true });
      showToast("success", reponseData.message);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      showToast("error", error.message);
    }
  }

  const handleFileSelection = (files) => {
    const selectedFile = files[0];

    if (!selectedFile) return;

    //Validate File size(e.g. max 5MB)
    const maxSize = 5 * 1024 * 1024; //5MB in bytes
    if (selectedFile.size > maxSize) {
      showToast("error", "File too large! Max 5MB");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      showToast("error", "Please select an image file");
      return;
    }

    //When you select a file from your computer, you have a File object, but you can't directly display it in an <img> tag or avatar.

    const preview = URL.createObjectURL(selectedFile); //This creates a temporary URL that points to the file in your browser's memory.
    setFilePreview(preview);
    // preview = "blob:http://localhost:5173/abc-123-def-456"
    setFile(selectedFile);
    console.log(selectedFile);
  };

  useEffect(() => {
    //This function runs when component unmounts OR filePreview changes
    //It runs before setting new filePreview
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview); // Delete old URL from memory
        console.log("Preview Removed: ", filePreview);
      }
    };
  }, [filePreview]); // Runs whenever filePreview changes
  if (loading) return <Loading />;

  // Dropzone gives you these two functions
  // getRootProps = makes any div clickable
  // getInputProps = creates a hidden file input

  //     User clicks Avatar
  //         ↓
  //     getRootProps() detects the click
  //         ↓
  //     Triggers the hidden <input type="file">
  //         ↓
  //     File picker dialog opens
  //         ↓
  //     User selects a file
  //         ↓
  //     onDrop fires → calls handleFileSelection(files)
  //         ↓

  return (
    <Card className=" max-w-screen-md mx-auto px-15">
      <CardContent>
        <div className="flex justify-center items-center mt-5">
          <Dropzone
            onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group">
                  <AvatarImage
                    src={
                      filePreview ? filePreview : userData?.avatar || userImage
                    }
                    className="w-full h-full object-contain rounded-full"
                  />
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 duration-300 cursor-pointer">
                    <IoCameraOutline className="text-xl text-white transform transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
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
                        <Input placeholder="Enter your Name" {...field} />
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
                        <Input placeholder="Enter your password" {...field} />
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
  );
};

export default Profile;
