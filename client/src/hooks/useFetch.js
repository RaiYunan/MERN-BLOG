import { useEffect, useState } from "react"

export const useFetch=(url,options={},dependencies=[])=>{
    const [data,setData]=useState()
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(null)

    useEffect(()=>{
        const fetchData=async()=>{
            // Don't fetch if url is null/undefined
        if (!url) {
            setLoading(false);
            return;
        }
            try {
                console.log("Fetching from URL:", url);
                const response = await fetch(url, options)
                const responseData = await response.json()
                
                console.log("Fetch response:", responseData);
                if(!response.ok){
                   throw new Error(`Error ${response.status}: ${response.statusText}`)
                }
                // setData(responseData.data)
                 // Check if response has data property (your API structure)
                if (responseData.data) {
                    console.log("Setting data:", responseData.data);
                    setData(responseData.data)
                } else {
                    console.log("Setting full response:", responseData);
                    setData(responseData)
                }
                setError(null)       
            } catch (error) {
                console.log("Error messgae in useFetch\n",error.message)
                setError(error.message)
                setData(null)
            }finally{
                setLoading(false)
            }    
        }
        fetchData()
    },[url,...dependencies])
    return {data,loading,error}
}