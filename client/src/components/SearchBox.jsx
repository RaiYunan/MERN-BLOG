import React, { useState } from "react";
import { Input } from "./ui/input";
import { FaSearch } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { RouteBlogShowBySearch } from "@/helpers/RouteName";
const SearchBox = () => {
  const [input, setInput] = useState("");
  const navigate=useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(RouteBlogShowBySearch(input.trim()))
    setInput("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-4 md:w-4 w-3"  />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search Here...."
            className="h-9 bg-gray-100 pl-9 md:w-[500px] w-[140px] md:text-sm text-[12px]" // Important: left padding to make space for icon
          />
            {input.trim() && <FaRegCircleXmark  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-4 w-4" onClick={()=>setInput("")} /> }
         
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
