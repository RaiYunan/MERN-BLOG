import { useEffect, useState } from "react"

export const useFetch=(url,options={},dependencies=[])=>{
    const [data,setData]=useState()
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(null)

    useEffect(()=>{
        const fetchData=async()=>{
            setLoading(true)
            try {
                const response=await fetch(url,options)
                const data=await response.json()
                if(!response.ok){
                   throw new Error(`Error ${response.status}: ${response.statusText}`)
                }
                setData(data.data)
                setError(null)       
            } catch (error) {
                setError(error.message)
                console.log("Error messgae in useFetch\n",error.message)
            }finally{
                setLoading(false)
            }    
        }
        fetchData()
    },[url,...dependencies])
    return {data,loading,error}
}