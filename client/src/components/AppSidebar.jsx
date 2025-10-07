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
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-white.png";
import { IoHome } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { FaBlogger } from "react-icons/fa6";
import { FaComments } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { RouteBlog, RouteCategoryDetails, RouteIndex } from "@/helpers/RouteName";

const AppSideBar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="bg-white">
        <div className="cursor-pointer">
          <img src={logo} width={150} />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
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
              <Link to="">
                <SidebarMenuButton className="cursor-pointer">
                  <FaComments />
                  Comments
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link to="">
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
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <GoDotFill />
                <Link to="">Category Item</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
