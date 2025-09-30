import { useEffect, useState } from "react"

export const useFetch=(url,options,dependencies=[])=>{
    const [data,setData]=useState()
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)

    useEffect(()=>{
        const fetchData=async()=>{

            try {
                const response=await fetch(url,options)
                const data=await response.json()
                if(!response.ok){
                   throw new Error(`Error: ${response.statusText,response.status}`)
                }
                setData(data)
                setError(null)       
            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false)
            }    
        }
        fetchData()
    },dependencies)
    return {data,loading,error}
}