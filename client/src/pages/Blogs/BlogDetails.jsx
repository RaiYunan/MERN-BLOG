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
import { showToast } from "@/helpers/showToast";
import { useSelector } from "react-redux";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [open, setOpen] = useState(false);

  const user=useSelector(state=>state.user);
  const isUser=(user && user.isLoggedIn )?true: false;
  const isAdmin=(user && user.isLoggedIn && user.user.role==="admin" )?true: false;

  const baseUrl=`${import.meta.env.VITE_URL}/blog`;
  const blog_Url = `${baseUrl}/${isAdmin?"all-blogs":"my-blogs"}`;
  const {
    data: blogData,
    loading: blogLoading,
    error: blogError,
  } = useFetch(
    blog_Url,
    {
      method: "GET",
      credentials: "include",
    },
    [refreshData]
  );
  console.log(blogData);

  const ConfirmDialog = ({ open, onClose, onConfirm, title, description }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] px-10 py-12 flex-col gap-6">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="cursor-pointer"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const openDeleteDialog = (blogId) => {
    setBlogToDelete(blogId);
    setOpen(true);
  };

  const closeDeleteDialog = () => {
    setOpen(false);
    setBlogToDelete(null);
  };

  const handleDelete = async () => {
    if (!blogToDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/blog/delete-blog/${blogToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const responseData = await response.json();
      console.log("responseData inside HandleDelete\n", responseData);

      if (!response.ok) {
        showToast("error", responseData.message);
        return;
      }
      closeDeleteDialog();
      showToast("success", responseData.message || "Blog deleted successfully");
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Failed to delete blog. Please try again.");
    }
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
          <div className="flex items-center gap-2">
           {isAdmin?<p>All Blogs</p>:<p>My Blogs</p>}
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
                {blogData && blogData.length > 0 ? (
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
                              onClick={() => openDeleteDialog(blog._id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground pt-8"
                    >
                      No Blogs available. Create your first blog!!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </div>
      </Card>

      <ConfirmDialog
        open={open}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete this blog?"
        description="This action cannot be undone. The blog will be permanently deleted."
      />
    </div>
  );
};

export default BlogDetails;
