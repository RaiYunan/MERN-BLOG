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


const CommentsList = () => {
  const [refreshData, setRefreshData] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [open, setOpen] = useState(false);

  const url = `${import.meta.env.VITE_URL}/blog/comments`;
  const {
    data: commentsData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

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
    console.log("Button clicked.")
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
    console.log("gula")
  };
  console.log("Comments Data;-\n", commentsData);
  if (loading) return <Loading />;
  return (
    <div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">Blog Post</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[120px]">Comment By</TableHead>
                <TableHead className="w-[100px]">Date Posted</TableHead>
                <TableHead className="w-[180px]">Comment Content</TableHead>
                <TableHead className="w-[80px] text-center">Status</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commentsData && commentsData.length > 0
                ? commentsData.map((comment) => {
                    return (
                      <TableRow key={comment._id}>
                        <TableCell className="max-w-[350px] whitespace-normal break-words">
                          {comment.blogId.title}
                        </TableCell>
                        <TableCell className="w-[150px]">
                          {comment.blogId.category.name}
                        </TableCell>
                        <TableCell className="w-[120px]">
                          {comment.author.name}
                        </TableCell>
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
                          {comment.status}
                        </TableCell>
                        <TableCell className="w-[120px] text-center">
                          <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={()=>openDeleteDialog(comment._id)}
                          >
                            <MdDelete  />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : "No comments available"}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={open}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete this comment?"
        description="This action cannot be undone. The blog will be permanently deleted."
      />
    </div>
  );
};

export default CommentsList;
