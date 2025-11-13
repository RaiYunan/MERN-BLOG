import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-white.png";
import { IoHome } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { FaBlogger } from "react-icons/fa6";
import { FaComments } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
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

const AppSideBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isUser = user && user.isLoggedIn;
  const isAdmin = user && user.isLoggedIn && user.user.role === "admin";

  const url = `${import.meta.env.VITE_URL}/category/all-category`;
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  const handleCategoryClick = (categoryId, categorySlug) => {
    console.log(categoryId);
    navigate(RouteBlogShowByCategory(categorySlug));
  };
  if (!categoryData && categoryData?.length == 0) return <Loading />;
  return (
    <Sidebar className="bg-white border-r border-gray-200 min-h-screen">
      {/* Header */}
      <SidebarHeader className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-center">
        <div className="cursor-pointer">
          <img src={logo} alt="Blog Logo" width={130} className="mx-auto" />
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-white overflow-y-auto">
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to={RouteIndex}>
                <SidebarMenuButton className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition">
                  <IoHome className="text-gray-700" />
                  <span className="text-gray-800 text-sm md:text-base">
                    Home
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {isAdmin && (
              <SidebarMenuItem>
                <Link to={RouteCategoryDetails}>
                  <SidebarMenuButton className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition">
                    <TbCategoryFilled className="text-gray-700" />
                    <span className="text-gray-800 text-sm md:text-base">
                      Categories
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}

            {isUser && (
              <>
                <SidebarMenuItem>
                  <Link to={RouteBlog}>
                    <SidebarMenuButton className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition">
                      <FaBlogger className="text-gray-700" />
                      <span className="text-gray-800 text-sm md:text-base">
                        Blogs
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link to={RouteShowComments}>
                    <SidebarMenuButton className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition">
                      <FaComments className="text-gray-700" />
                      <span className="text-gray-800 text-sm md:text-base">
                        Comments
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}

            {isAdmin && (
              <SidebarMenuItem>
                <Link to={RouteShowUsers}>
                  <SidebarMenuButton className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition">
                    <FaUsers className="text-gray-700" />
                    <span className="text-gray-800 text-sm md:text-base">
                      Users
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-gray-700 text-sm px-4">
            Categories
          </SidebarGroupLabel>
          {categoryData?.length > 0 &&
            categoryData.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id, category.slug)}
              >
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition">
                      <GoDotFill className="text-gray-500" />
                      <span className="text-gray-800 text-sm">
                        {category.name}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
