import React from "react";
import logo from "../assets/images/logo-white.png";
import { Button } from "./ui/button";

import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import {
  RouteBlogAdd,
  RouteIndex,
  RouteProfile,
  RouteSignIn,
} from "@/helpers/RouteName";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userImage from "../assets/images/download.png";
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { showToast } from "@/helpers/showToast";
import { removeUser } from "@/redux/user/user.slice";

const TopBar = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogOut() {
    try {
      const url = `${import.meta.env.VITE_URL}/auth/logout`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // must be OUTSIDE headers
      });
      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      console.log(data);
      dispatch(removeUser());
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      console.log(error);
      showToast("error", error.message);
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-20 flex items-center justify-between h-16 bg-white border-b border-gray-200 shadow-sm px-4 md:px-8">
      {/* Logo */}
      <Link to={RouteIndex} className="flex-shrink-0">
        <img
          src={logo}
          alt="Blog Logo"
          className="cursor-pointer h-8 md:h-10 w-auto"
        />
      </Link>

      {/* Search */}
      <div className="md:w-[500px] w-[120px]">
        <SearchBox />
      </div>

      {/* Right section */}
      <div>
        {!user.isLoggedIn ? (
          <Button asChild size="sm" className="rounded-md">
            <Link to={RouteSignIn} className="flex items-center gap-2">
              <FaSignInAlt className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-[11px] md:text-sm">Sign In</span>
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer ring-1 ring-gray-200">
                <AvatarImage
                  src={
                    user.user?.avatar || user.user?.data?.avatar || userImage
                  }
                  alt={user.user?.name || "User"}
                  crossOrigin="anonymous"
                  onError={() =>
                    console.error("Avatar load failed:", user.user?.avatar)
                  }
                />
                <AvatarFallback>
                  {user.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p className="text-base font-medium">
                  {user.user?.name || user.user?.data?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user.user?.email || user.user?.data?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={RouteProfile} className="flex items-center gap-2">
                  <FaRegUser /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={RouteBlogAdd} className="flex items-center gap-2">
                  <FaPlus /> Create Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogOut}
                className="text-red-500 flex items-center gap-2 cursor-pointer"
              >
                <FiLogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TopBar;
