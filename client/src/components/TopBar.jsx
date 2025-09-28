import React from 'react'
import logo from "../assets/images/logo-white.png"
import { Button } from './ui/button'

import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';
import { RouteIndex, RouteSignIn } from '@/helpers/RouteName';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import userImage from "../assets/images/download.png"
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { showToast } from '@/helpers/showToast';
import { removeUser } from '@/redux/user/user.slice';


const TopBar = () => {
  const user=useSelector((state)=>state.user)
  const navigate=useNavigate()
  const dispatch=useDispatch()

  async function handleLogOut(){
    try {
      const url=`${import.meta.env.VITE_URL}/logout`
      const response = await fetch(url, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         credentials: "include"  // must be OUTSIDE headers
});
      const data=await response.json()

      if(!response.ok){
        showToast("error",data.message)
        return;
      }
      console.log(data)
      dispatch(removeUser())
      navigate(RouteIndex)
      showToast("success",data.message)

      
    } catch (error) {
      console.log(error)
      showToast("error",error.message)
      
    }
    
  }

  return (
    <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white border-b border-gray-300 border-[2px] '>
      <div>
        <img src={logo} width={160}/>
      </div>
      <div className='w-[600px]'>
        <SearchBox/>
      </div>
      <div className='px-4'>
        {!user.isLoggedIn?
        (<Button asChild>
          <Link to={RouteSignIn} className='rounded-md'>
           <FaSignInAlt />
           Sign In
           </Link>
        </Button>)
        :
        <div className='cursor-pointer'>
          <DropdownMenu>
  <DropdownMenuTrigger>
    <Avatar>
  <AvatarImage src={user.user.avatar || userImage} />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>
      <p className='text-base'>{user.user.name}</p>
      <p className='text-xs'>{user.user.email}</p>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link to="">
      <FaRegUser />
      Profile
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link to="">
      <FaPlus/>
      Create Blog
      </Link>
    </DropdownMenuItem>

    <DropdownMenuSeparator/>
    <DropdownMenuItem onClick={handleLogOut}>
      <FiLogOut color='red'/>
      Logout
     
    </DropdownMenuItem>
    
  </DropdownMenuContent>
  </DropdownMenu>
        </div>

        }
      </div>

    </div>
  )
}

export default TopBar
