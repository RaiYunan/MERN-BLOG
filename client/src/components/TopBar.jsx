import React from 'react'
import logo from "../assets/images/logo-white.png"
import { Button } from './ui/button'

import { FaSignInAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';
import { RouteSignIn } from '@/helpers/RouteName';


const TopBar = () => {
  return (
    <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white border-b border-gray-300 border-[2px] '>
      <div>
        <img src={logo} width={160}/>
      </div>
      <div className='w-[600px]'>
        <SearchBox/>
      </div>
      <div className='px-4'>
        <Button asChild>
          <Link to={RouteSignIn} className='rounded-md'>
           <FaSignInAlt />
           Sign In
           </Link>
         
        </Button>
      </div>

    </div>
  )
}

export default TopBar
