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

const AppSideBar = () => {
  const navigate = useNavigate();
  const url = `${import.meta.env.VITE_URL}/category/all-category`;
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    credentials: "include",
  });

  const handleCategoryClick = (categoryId,categorySlug) => {
    console.log(categoryId);
    navigate(RouteBlogShowByCategory(categorySlug))
  };
  if (!categoryData && categoryData?.length == 0) return <Loading />;
  return (
    <Sidebar>
      <SidebarHeader className="bg-white">
        <div className="cursor-pointer">
          <img src={logo} width={150} />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup className="">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to={RouteIndex}>
                <SidebarMenuButton className="cursor-pointer">
                  <IoHome />
                  Home
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link to={RouteCategoryDetails}>
                <SidebarMenuButton className="cursor-pointer">
                  <TbCategoryFilled />
                  Categories
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link to={RouteBlog}>
                <SidebarMenuButton className="cursor-pointer">
                  <FaBlogger />
                  Blogs
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link to={RouteShowComments}>
                <SidebarMenuButton className="cursor-pointer">
                  <FaComments />
                  Comments
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link to={RouteShowUsers}>
                <SidebarMenuButton className="cursor-pointer">
                  <FaUsers />
                  Users
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          {categoryData &&
            categoryData?.length > 0 &&
            categoryData.map((category) => {
              return (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id,category.slug)}
                >
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link to="">
                        <SidebarMenuButton className="cursor-pointer">
                          <GoDotFill />
                          {category.name}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              );
            })}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
