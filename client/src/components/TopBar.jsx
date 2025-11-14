import React from "react";
import logo from "../assets/images/logo-white.png";
import { Button } from "./ui/button";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import {
  RouteAccount,
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
import { GiHamburgerMenu } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";

const TopBar = ({ onMenuClick }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogOut() {
    try {
      const url = `${import.meta.env.VITE_URL}/auth/logout`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
        return;
      }

      dispatch(removeUser());
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      console.log(error);
      showToast("error", error.message);
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-30 flex items-center justify-between h-16 bg-white border-b border-gray-200 shadow-sm px-4 md:px-8 gap-3">
      {/* LEFT: Hamburger + Logo */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
        >
          <GiHamburgerMenu className="text-xl text-gray-700" />
        </button>

        {/* Logo */}
        <Link to={RouteIndex} className="flex-shrink-0">
          <img
            src={logo}
            alt="Blog Logo"
            className="cursor-pointer h-7 md:h-9 w-auto"
          />
        </Link>
      </div>

      <div className="flex-1 flex justify-center px-2">
        <div className="w-full max-w-[220px] sm:max-w-[300px] md:max-w-[220px] lg:min-w-[500px]">
          <SearchBox />
        </div>
      </div>

      {/* RIGHT: User / Sign In */}
      <div className="flex-shrink-0">
        {!user.isLoggedIn ? (
          <Button asChild size="sm" className="rounded-md h-9">
            <Link
              to={RouteSignIn}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3"
            >
              <FaSignInAlt className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-xs md:text-sm whitespace-nowrap">
                Sign In
              </span>
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Avatar className="cursor-pointer ring-1 ring-gray-200 w-8 h-8 md:w-9 md:h-9">
                  <AvatarImage
                    src={
                      user.user?.avatar || user.user?.data?.avatar || userImage
                    }
                    alt={user.user?.name || "User"}
                    crossOrigin="anonymous"
                  />
                  <AvatarFallback className="text-xs md:text-sm">
                    {user.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium truncate">
                  {user.user?.name || user.user?.data?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.user?.email || user.user?.data?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to={RouteProfile}
                  className="flex items-center gap-2 text-base font-medium cursor-pointer"
                >
                  <FaRegUser className="w-4 h-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={RouteBlogAdd}
                  className="flex items-center gap-2 text-base font-medium cursor-pointer"
                >
                  <FaPlus className="w-4 h-4" /> Create Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={RouteAccount}
                  className="flex items-center gap-2 text-base font-medium cursor-pointer"
                >
                  <MdAccountCircle className="text-2xl" /> Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogOut}
                className="text-red-500 flex items-center gap-2 cursor-pointer font-medium text-sm"
              >
                <FiLogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TopBar;
