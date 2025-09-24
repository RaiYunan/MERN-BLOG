import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-blog-a7c2e.firebaseapp.com",
  projectId: "mern-blog-a7c2e",
  storageBucket: "mern-blog-a7c2e.firebasestorage.app",
  messagingSenderId: "908353815474",
  appId: "1:908353815474:web:fb3d36f5a980ee77a49aab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}