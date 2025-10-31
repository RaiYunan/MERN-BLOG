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
  const isAdmin = user && user.isLoggedIn && user.user.role === "admin" || false;

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
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaComments className="text-blue-500" />
            {isAdmin ? "All Comments" : "My Comments"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">Blog Post</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                {isAdmin && (
                  <>
                    <TableHead className="w-[120px]">Comment By</TableHead>
                  </>
                )}
                <TableHead className="w-[100px]">Date Posted</TableHead>
                <TableHead className="w-[180px]">Comment Content</TableHead>
                <TableHead className="w-[80px] text-center">Status</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commentsData && commentsData.length > 0 ? (
                commentsData.map((comment) => {
                  return (
                    <TableRow key={comment._id}>
                      <TableCell className="max-w-[350px] whitespace-normal break-words">
                        {comment.blogId.title}
                      </TableCell>
                      <TableCell className="w-[150px]">
                        {comment.blogId.category.name}
                      </TableCell>
                      {isAdmin && (
                        <>
                          <TableHead className="w-[120px]">
                            {comment.author.name}
                          </TableHead>
                        </>
                      )}

                      <TableCell className="w-[100px]">
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
                      <TableCell className="w-[80px] text-center">
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
                      <TableCell className="w-[120px] text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => openDeleteDialog(comment._id)}
                        >
                          <MdDelete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 7 : 6}
                    className="h-64 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                      <FaRegComments className="h-16 w-16 opacity-20" />
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                          No Comments Found{" "}
                        </h3>
                        <p className="max-w-sm mx-auto">
                          <p className="whitespace-pre-line">
                            {isAdmin
                              ? "There are no comments in the system yet.\nComments will appear here once users start engaging with your blog posts."
                              : "You haven't posted any comments yet.\nStart engaging with blog posts to see your comments here."}
                          </p>
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
