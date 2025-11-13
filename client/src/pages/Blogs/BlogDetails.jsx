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
import { FileText, Plus } from "lucide-react";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const isUser = user && user.isLoggedIn ? true : false;
  const isAdmin =
    user && user.isLoggedIn && user.user.role === "admin" ? true : false;

  const baseUrl = `${import.meta.env.VITE_URL}/blog`;
  const blog_Url = `${baseUrl}/${isAdmin ? "all-blogs" : "my-blogs"}`;
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {isAdmin ? "All Blogs" : "My Blogs"}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {isAdmin
                ? "Manage all blog posts across the platform"
                : "View and manage your published blog posts"}
            </CardDescription>
          </div>

          <Button asChild className="cursor-pointer w-full sm:w-auto">
            <Link to={RouteBlogAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Blog
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <div className="rounded-md border">
            {/* Desktop Table */}
            <div className="hidden sm:block">
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
                          <TableCell>
                            {blog.author?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {blog.category?.name || "Uncategorized"}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs whitespace-normal break-words">
                              {blog.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs whitespace-normal break-words font-mono text-sm">
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
                                className="cursor-pointer h-8 w-8 p-0"
                                asChild
                              >
                                <Link to={`/blog/${blog.slug}`}>
                                  <FaEye className="h-3 w-3" />
                                </Link>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="cursor-pointer h-8 w-8 p-0"
                                asChild
                              >
                                <Link to={RouteBlogEdit(blog._id)}>
                                  <FaEdit className="h-3 w-3" />
                                </Link>
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                className="cursor-pointer h-8 w-8 p-0"
                                onClick={() => openDeleteDialog(blog._id)}
                              >
                                <MdDelete className="h-3 w-3" />
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
                        className="text-center text-muted-foreground py-16"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <FileText className="h-12 w-12 opacity-50" />
                          <div>
                            <p className="font-semibold">No Blogs Available</p>
                            <p className="text-sm">Create your first blog!</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden">
              {blogData && blogData.length > 0 ? (
                blogData.map((blog) => (
                  <div key={blog._id} className="border-b p-4 last:border-b-0">
                    <div className="space-y-3">
                      {/* Header with title and actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {blog.category?.name || "Uncategorized"}
                            </span>
                            <span>•</span>
                            <span>{blog.author?.name || "Unknown"}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer h-7 w-7 p-0"
                            asChild
                          >
                            <Link to={`/blog/${blog.slug}`}>
                              <FaEye className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer h-7 w-7 p-0"
                            asChild
                          >
                            <Link to={RouteBlogEdit(blog._id)}>
                              <FaEdit className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer h-7 w-7 p-0"
                            onClick={() => openDeleteDialog(blog._id)}
                          >
                            <MdDelete className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Slug and Date */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Slug:</span>
                          <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs break-all">
                            {blog.slug}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Published:
                          </span>
                          <span>
                            {new Date(blog.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-16 px-4">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-12 w-12 opacity-50" />
                    <div>
                      <p className="font-semibold">No Blogs Available</p>
                      <p className="text-sm">Create your first blog!</p>
                    </div>
                    <Button asChild className="mt-2">
                      <Link
                        to={RouteBlogAdd}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Blog
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
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
