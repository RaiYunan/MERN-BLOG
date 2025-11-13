import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-white.png";
import { IoHome } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { FaBlogger } from "react-icons/fa6";
import { FaComments, FaUsers } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import {
  RouteBlog,
  RouteBlogShowByCategory,
  RouteCategoryDetails,
  RouteIndex,
  RouteShowComments,
  RouteShowUsers,
} from "@/helpers/RouteName";
import Loading from "./Loading";
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";

const AppSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isUser = user && user.isLoggedIn;
  const isAdmin = user && user.isLoggedIn && user.user.role === "admin";

  const url = `${import.meta.env.VITE_URL}/category/all-category`;
  const { data: categoryData, loading } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  const handleCategoryClick = (categoryId, categorySlug) => {
    navigate(RouteBlogShowByCategory(categorySlug));
    onClose?.();
  };

  const handleLinkClick = () => {
    onClose?.();
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 flex items-center justify-between ">
          <Link to={RouteIndex}>
          <img src={logo} alt="Blog Logo" width={140} className="cursor-pointer" /></Link>
          <button
            onClick={onClose}
            className="md:hidden text-gray-600 hover:text-gray-900 p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="py-4">
            {/* Navigation Menu */}
            <div className="mb-4">
              <div className="space-y-1">
                <Link
                  to={RouteIndex}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <IoHome className="text-md" />
                  <span>Home</span>
                </Link>

                {isAdmin && (
                  <Link
                    to={RouteCategoryDetails}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <TbCategoryFilled className="text-md" />
                    <span>Categories</span>
                  </Link>
                )}

                {isUser && (
                  <>
                    <Link
                      to={RouteBlog}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaBlogger className="text-md" />
                      <span>Blogs</span>
                    </Link>

                    <Link
                      to={RouteShowComments}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaComments className="text-md" />
                      <span>Comments</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to={RouteShowUsers}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FaUsers className="text-md" />
                    <span>Users</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <div className="px-4 mb-3">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  Categories
                </h3>
              </div>
              <div className="space-y-1">
                {categoryData?.length > 0 ? (
                  categoryData.map((category) => (
                    <button
                      key={category._id}
                      onClick={() =>
                        handleCategoryClick(category._id, category.slug)
                      }
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full text-left cursor-pointer"
                    >
                      <GoDotFill className="text-gray-500 text-sm" />
                      <span className="truncate">{category.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No categories found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSideBar;
