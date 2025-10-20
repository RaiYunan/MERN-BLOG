import { showToast } from "@/helpers/showToast"
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
                const response = await fetch(url, options)
                const responseData = await response.json()
                
                if(!response.ok){
                   throw new Error(`Error ${response.status}: ${response.statusText}`)
                }
                // console.log("ResponseData\n",responseData)
                setData(responseData.data)
                setError(null) 
                return;   
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