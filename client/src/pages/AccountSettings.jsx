import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { showToast } from "@/helpers/showToast";
import { removeUser } from "@/redux/user/user.slice";
import { useNavigate } from "react-router-dom";
import { RouteIndex } from "@/helpers/RouteName";

const ChangePassword = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const user = useSelector((state) => state.user);
  console.log(user);
  const isGoogleUser =
    (user && user.isLoggedIn && user.user.authProvider === "google") || false;

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [open, setOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const formSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^\S+$/, "Password cannot contain spaces")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
      confirmNewPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit(values) {
    console.log("Password change submitted:", values);
    // Add your API call here
  }

  // Helper function to toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

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

  const openDeleteDialog = (userId) => {
    setAccountToDelete(userId);
    setOpen(true);
  };

  const closeDeleteDialog = () => {
    setOpen(false);
    setAccountToDelete(null);
  };
  const handleDelete = async () => {
    if (!accountToDelete) return;

    try {
      const delete_url = `${
        import.meta.env.VITE_URL
      }/users/delete-user/${accountToDelete}`;
      const deleteResponse = await fetch(delete_url, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Response status:", deleteResponse.status);
      console.log("Response ok:", deleteResponse.ok);

      const result = await deleteResponse.json();
      console.log("Response data:", result);
      if (!deleteResponse.ok) {
        showToast("error", "Can't delete account. Something went wrong.");
        return;
      }

      showToast("success", "Account deleted successfully");

      // Clear local state and redirect
      dispatch(removeUser());
      setAccountToDelete(null);
      setOpen(false);
      navigate(RouteIndex);
    } catch (error) {
      console.error("Delete account error:", error);
      showToast("error", "Something went wrong during account deletion");
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <Card className="shadow-lg border border-gray-100">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Account Settings
          </CardTitle>
          <p className="text-gray-600 text-sm mt-1">
            Manage your account security
          </p>
        </CardHeader>
        <div className="border-t border-gray-100" />

        {!isGoogleUser ? (
          <>
            {/* Change Password */}
            <CardContent>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Change Password
                </h2>
                <p className="text-gray-600 text-sm">
                  Create a strong new password to secure your account
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Current Password */}
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword.current ? "text" : "password"}
                              placeholder="Enter your current password"
                              className="pr-10 transition-colors focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("current")
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                            >
                              {showPassword.current ? (
                                <FaEyeSlash className="w-4 h-4" />
                              ) : (
                                <FaEye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* New Password */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword.new ? "text" : "password"}
                              placeholder="Create a new password"
                              className="pr-10 transition-colors focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("new")}
                              className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                            >
                              {showPassword.new ? (
                                <FaEyeSlash className="w-4 h-4" />
                              ) : (
                                <FaEye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm New Password */}
                  <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword.confirm ? "text" : "password"}
                              placeholder="Confirm your new password"
                              className="pr-10 transition-colors focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                            >
                              {showPassword.confirm ? (
                                <FaEyeSlash className="w-4 h-4" />
                              ) : (
                                <FaEye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 font-medium transition-colors"
                  >
                    Change Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        ) : (
          <CardContent>
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Password Settings
              </h2>
              <p className="text-sm text-gray-600">
                Your account uses{" "}
                <span className="font-medium">Google Sign-In</span>. Password
                changes must be managed through your Google Account.
              </p>
            </div>
          </CardContent>
        )}
        {/* Divider */}
        <div className="border-t border-gray-100 mx-6" />

        {/* Delete Account */}
        <CardContent className="pt-3 pb-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2 mb-1">
              <FaExclamationTriangle className="w-4 h-4" /> Danger Zone
            </h2>
            <p className="text-sm text-gray-600">
              Deleting your account is permanent and cannot be undone.
            </p>
          </div>
          <div className="space-y-3 text-sm text-gray-700 pb-4">
            <p className="font-medium">
              Before proceeding, please understand that:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>All your data will be permanently deleted</li>
              <li>Your blogs and comments will be removed</li>
              <li>This action cannot be reversed</li>
              <li>
                You will need to create a new account to use our services again
              </li>
            </ul>
          </div>

          <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 font-medium"
            onClick={() =>
              openDeleteDialog(user.user._id || user.user.data._id)
            }
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={open}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete this account?"
        description="This action cannot be undone. The account will be permanently deleted."
      />
    </div>
  );
};

export default ChangePassword;
