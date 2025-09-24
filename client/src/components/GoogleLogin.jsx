import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';

const GoogleLogin = () => {
    const handleLogin=async()=>{
        const googleResponse=await signInWithPopup(auth,provider)
        console.log(googleResponse);
    }
  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
        <FcGoogle />
        Continue with Google

    </Button>
  )
}

export default GoogleLogin
