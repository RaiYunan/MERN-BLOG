import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import { RouteIndex, RouteSignIn, RouteSignUp } from './helpers/RouteName'
import Index from './pages'
import SignIn from './pages/Signin'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout/>}>
          <Route index element={<Index/>}/>
        </Route>
        <Route path={RouteSignIn} element={<SignIn/>}/>
        <Route path={RouteSignUp} element={<SignUp/>}/>

      </Routes>
    
    </BrowserRouter>
  )
}

export default App
