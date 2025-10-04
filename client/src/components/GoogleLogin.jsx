import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { showToast } from '@/helpers/showToast';
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';

const GoogleLogin = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()

    const handleLogin=async()=>{
        
        try {
          const googleResponse=await signInWithPopup(auth,provider)

          const user=googleResponse.user
          console.log("googleRespnse",googleResponse)
          const bodyData={
            name:user.displayName,
            email:user.email,
            avatar:user.photoURL
          }
        
        const url=`${import.meta.env.VITE_URL}/auth/google-login`

          const response=await fetch(url,{
            method:"POST",
            headers:{"Content-type":"application/json"},
            credentials:"include",
            body:JSON.stringify(bodyData)

          }
          )

          const responseData=await response.json()
          if(!response.ok){
            showToast("error",responseData.message||"Something is wrong.Try again");
            return;
          }

          dispatch(setUser(responseData.data));
          navigate(RouteIndex,{replace:true});
          showToast("success",responseData.message);

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
