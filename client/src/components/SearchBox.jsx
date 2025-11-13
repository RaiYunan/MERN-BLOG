import React, { useState } from "react";
import { Input } from "./ui/input";
import { FaSearch } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { RouteBlogShowBySearch } from "@/helpers/RouteName";

const SearchBox = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(RouteBlogShowBySearch(input.trim()));
      setInput("");
    }
  };

  const clearInput = () => {
    setInput("");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-3 w-3 sm:h-4 sm:w-4" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search Here..."
            className="h-9 bg-gray-100 pl-9 pr-9 w-full placeholder:text-gray-500 focus:bg-white transition-colors md:text-sm text-[10px]"
          />
          {input.trim() && (
            <FaRegCircleXmark
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 h-3 w-3 sm:h-4 sm:w-4 transition-colors"
              onClick={clearInput}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBox;