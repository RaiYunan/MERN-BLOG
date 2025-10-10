import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Link } from "react-router-dom";
import { RouteBlog, RouteBlogAdd, RouteBlogEdit } from "@/helpers/RouteName";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const BlogDetails = () => {
  const blog_Url = `${import.meta.env.VITE_URL}/blog/all-blogs`;
  const {
    data: blogData,
    loading: blogLoading,
    error: blogError,
  } = useFetch(blog_Url, {
    method: "GET",
    credentials: "include",
  });
  const [open, setOpen] = useState(false);

  const ConfirmDialog = ({ open, onClose, onConfirm, title, description }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const handleDelete = (blogId) => {
    console.log("✅ Blog deleted successfully!", blogId);
    setOpen(false);
  };

  if (blogLoading) return <Loading />;
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild className="cursor-pointer">
              <Link to={RouteBlogAdd}>Add Blog</Link>
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Author Name</TableHead>
                  <TableHead className="w-28">Category</TableHead>
                  <TableHead>Blog Title</TableHead>
                  <TableHead>URL Slug</TableHead>
                  <TableHead className="w-32">Published Date</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {blogData &&
                  blogData.length > 0 &&
                  blogData.map((blog) => {
                    return (
                      <TableRow key={blog._id}>
                        <TableCell>{blog.author?.name || "Unknown"}</TableCell>
                        <TableCell>
                          {blog.category?.name || "Uncategorized"}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs whitespace-normal break-words">
                            {blog.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className=" max-w-xs whitespace-normal break-words">
                            {blog.slug}
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {new Date(blog.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                            >
                              <Link>
                                <FaEye />
                              </Link>
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                            >
                              <Link to={RouteBlogEdit(blog._id)}>
                                <FaEdit />
                              </Link>
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="cursor-pointer"
                              onClick={()=>setOpen(true)}
                            >
                              <MdDelete />
                            </Button>
                            <ConfirmDialog
                              open={open}
                              onClose={() => setOpen(false)}
                              onConfirm={() => handleDelete(blog._id)}
                              title="Delete this blog?"
                              description="This action cannot be undone. The blog will be permanently deleted."
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default BlogDetails;
