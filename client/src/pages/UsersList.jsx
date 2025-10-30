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

const UsersList = () => {
  const [refreshData, setRefreshData] = useState(false);

  const url = `${import.meta.env.VITE_URL}/users/get-all-users`;
  const {
    data: usersData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  console.log("UsersData:\n", usersData);
  if (loading) return <Loading />;
  if (error) return <div>Error loading users</div>;

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

  return (
    <div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Role</TableHead>
                <TableHead className="w-[180px]">Full Name</TableHead>
                <TableHead className="w-[220px]">Email</TableHead>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead className="w-[140px]">Joined On</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData && usersData.length > 0 ? (
                usersData.map((user) => {
                  return (
                    <TableRow key={user._id}>
                      <TableCell className="w-[100px]">{user.role}</TableCell>
                      <TableCell className="w-[180px]">{user.name}</TableCell>
                      <TableCell className="w-[220px]">{user.email}</TableCell>
                      <TableCell className="w-[80px]">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          width="40"
                          height="40"
                          className="rounded-full object-cover"
                        />
                      </TableCell>
                      <TableCell className="w-[140px]">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="w-[120px] text-center">
                        <Button
                          className="cursor-pointer"
                          variant="destructive"
                          size="sm"
                        >
                          <MdDelete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          No Users Yet
                        </h3>
                        <p className="text-gray-500">
                          Your user list is empty. Users will appear here once
                          they register.
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

      {/* <ConfirmDialog
        open={open}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete this comment?"
        description="This action cannot be undone. The comment will be permanently deleted."
      /> */}
    </div>
  );
};

export default UsersList;
