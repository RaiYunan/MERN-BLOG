import React from 'react'
import { Input } from './ui/input'

const SearchBox = () => {
  return (
    <div>
        <form>
            <Input placeholder="Search Here...." className="h-9 bg-gray-100"/>
        </form>
      
    </div>
  )
}

export default SearchBox
