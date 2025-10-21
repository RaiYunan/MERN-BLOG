import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const SearchResult = () => {
    const [searchParams]=useSearchParams();
    const q=searchParams.get("q") || "Vetina muji"
  return (
    <div>
       {q}
    </div>
  )
}

export default SearchResult
