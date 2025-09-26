import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { showToast } from '@/helpers/showToast';
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from '@/helpers/RouteName';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';

const GoogleLogin = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
    const handleLogin=async()=>{
        
        try {
          const googleResponse=await signInWithPopup(auth,provider)

          const user=googleResponse.user
          const bodyData={
            name:user.displayName,
            email:user.email,
            avatar:user.photoURL
          }
        
        const url=`${import.meta.env.VITE_URL}/google-login`

          const response=await fetch(url,{
            method:"POST",
            headers:{"content-type":"application/json"},
            credentials:"include",
            body:JSON.stringify(bodyData)

          }
          )

          const data=await response.json()
          if(!response.ok){
            showToast("error",data.message||"Something is wrong.Try again");
            return;
          }

          showToast("success",data.message);
          console.log(data.data);
          dispatch(setUser(data.data));
          navigate(RouteIndex,{replace:true});

        } catch (error) {
          console.log("Error",error)
          showToast("error",error.message)
          
        }

    }
  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
        <FcGoogle />
        Continue with Google

    </Button>
  )
}

export default GoogleLogin
