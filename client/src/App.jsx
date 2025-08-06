import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from './components/ui/button'
import Layout from './Layout/Layout'


function App() {
  const [data,setData]=useState("");

  useEffect(()=>{
    axios.get("http://localhost:8000/api/data")
    .then((res)=>{
      console.log(res.data);
      setData(res.data.message);
    }).catch((err)=>{
      console.log("Error while fetching data",err);
    })

  })

  return (
    <>
    {/* <Layout/> */}
    <div>{data}</div>
     
      
    </>
  )
}

export default App
