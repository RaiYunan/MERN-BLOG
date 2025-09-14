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
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import logo from "../assets/images/logo-white.png"
import { IoHome } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { FaBlogger } from "react-icons/fa6";
import { FaComments } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { RouteIndex } from "@/helpers/RouteName";





const AppSideBar = () => {
  return (
     <Sidebar>
      <SidebarHeader className="bg-white">
        <img src={logo} width={150} className="cursor-pointer"/>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>

            <SidebarMenuItem>
              <SidebarMenuButton>
                <IoHome />
                <Link to={RouteIndex}>Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

             <SidebarMenuItem>
              <SidebarMenuButton>
                <TbCategoryFilled />
                <Link to="">Categories</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

             <SidebarMenuItem>
              <SidebarMenuButton>
                <FaBlogger />
                <Link to="">Blogs</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

             <SidebarMenuItem>
              <SidebarMenuButton>
              <FaComments />
                <Link to="">Comments</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaUsers />
                <Link to="">Users</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            

          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            Categories
          </SidebarGroupLabel>
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
  )
}

export default AppSideBar
