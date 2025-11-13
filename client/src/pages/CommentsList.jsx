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
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { showToast } from "@/helpers/showToast";
import { useSelector } from "react-redux";
import { FaComments, FaRegComments } from "react-icons/fa6";

const CommentsList = () => {
  const [refreshData, setRefreshData] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const isUser = user && user.isLoggedIn;
  const isAdmin =
    (user && user.isLoggedIn && user.user.role === "admin") || false;

  const baseUrl = `${import.meta.env.VITE_URL}/blog`;
  const url = isAdmin ? `${baseUrl}/comments` : `${baseUrl}/my-comments`;
  const {
    data: commentsData,
    loading,
    error,
  } = useFetch(
    url,
    {
      method: "GET",
      credentials: "include",
    },
    [refreshData]
  );

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

  const openDeleteDialog = (commentId) => {
    console.log("Button clicked.");
    setCommentToDelete(commentId);
    setOpen(true);
  };

  const closeDeleteDialog = () => {
    setOpen(false);
    setCommentToDelete(null);
  };

  const handleDelete = async () => {
    if (!commentToDelete) {
      return;
    }
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_URL
        }/blog/comments/delete-comment/${commentToDelete}`,
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
      showToast(
        "success",
        responseData.message || "Comment deleted successfully"
      );
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Failed to delete comment. Please try again.");
    }
  };
  console.log("Comments Data;-\n", commentsData);
  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
              <FaComments className="text-blue-500 h-5 w-5 sm:h-6 sm:w-6" />
              {isAdmin ? "All Comments" : "My Comments"}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {isAdmin
                ? "Manage and moderate all comments across the platform"
                : "View and manage your comment history"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                42
              </div>
              <div className="text-xs sm:text-sm">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                38
              </div>
              <div className="text-xs sm:text-sm">Approved</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="hidden sm:table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">Blog Post</TableHead>
                    <TableHead className="w-[150px]">Category</TableHead>
                    {isAdmin && (
                      <TableHead className="w-[120px]">Comment By</TableHead>
                    )}
                    <TableHead className="w-[100px]">Date Posted</TableHead>
                    <TableHead className="w-[180px]">Comment Content</TableHead>
                    <TableHead className="w-[80px] text-center">
                      Status
                    </TableHead>
                    <TableHead className="w-[120px] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commentsData && commentsData.length > 0 ? (
                    commentsData.map((comment) => (
                      <TableRow key={comment._id}>
                        <TableCell className="max-w-[350px] whitespace-normal break-words">
                          {comment.blogId.title}
                        </TableCell>
                        <TableCell>{comment.blogId.category.name}</TableCell>
                        {isAdmin && (
                          <TableCell>{comment.author.name}</TableCell>
                        )}
                        <TableCell>
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="max-w-[180px] whitespace-normal break-words">
                          {comment.content}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              comment.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : comment.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {comment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer h-8 w-8"
                            onClick={() => openDeleteDialog(comment._id)}
                          >
                            <MdDelete className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 7 : 6}
                        className="h-64 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                          <FaRegComments className="h-12 w-12 sm:h-16 sm:w-16 opacity-20" />
                          <div className="text-center">
                            <h3 className="text-base sm:text-lg font-semibold mb-2">
                              No Comments Found
                            </h3>
                            <p className="text-sm sm:text-base max-w-sm mx-auto whitespace-pre-line">
                              {isAdmin
                                ? "There are no comments in the system yet.\nComments will appear here once users start engaging with your blog posts."
                                : "You haven't posted any comments yet.\nStart engaging with blog posts to see your comments here."}
                            </p>
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
              {commentsData && commentsData.length > 0 ? (
                commentsData.map((comment) => (
                  <div
                    key={comment._id}
                    className="border-b p-4 last:border-b-0"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {comment.blogId.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {comment.blogId.category.name}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                comment.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : comment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {comment.status}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer h-7 w-7 ml-2 flex-shrink-0"
                          onClick={() => openDeleteDialog(comment._id)}
                        >
                          <MdDelete className="h-3 w-3" />
                        </Button>
                      </div>

                      {isAdmin && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">By: </span>
                          {comment.author.name}
                        </div>
                      )}

                      <div className="text-sm">
                        <span className="text-muted-foreground">Posted: </span>
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Comment:</p>
                        <p className="text-foreground line-clamp-2">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex items-center justify-center p-4">
                  <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <FaRegComments className="h-12 w-12 opacity-20" />
                    <div className="text-center">
                      <h3 className="text-base font-semibold mb-2">
                        No Comments Found
                      </h3>
                      <p className="text-sm whitespace-pre-line">
                        {isAdmin
                          ? "There are no comments in the system yet.\nComments will appear here once users start engaging with your blog posts."
                          : "You haven't posted any comments yet.\nStart engaging with blog posts to see your comments here."}
                      </p>
                    </div>
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
        title="Delete this comment?"
        description="This action cannot be undone. The comment will be permanently deleted."
      />
    </div>
  );
};

export default CommentsList;
