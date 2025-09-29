import AppSideBar from '@/components/AppSideBar'
import Footer from '@/components/Footer'
import TopBar from '@/components/TopBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (

    <SidebarProvider>
        <TopBar/>
        <AppSideBar/>
        <main className='w-full'>
             <div className='w-full min-h-[calc(100vh-60px)] py-28 px-10'>
              <Outlet/>
             </div>
             <Footer className="fixed bottom-0 w-full"/>
        </main>
    </SidebarProvider>

//     <SidebarProvider>
//   <AppSideBar>        // ← Sidebar wraps everything
//     <TopBar/>         // ← TopBar inside sidebar system
//     <main>
//       <Outlet/>
//       <Footer/>
//     </main>
//   </AppSideBar>
// </SidebarProvider>
  
  )
}

export default Layout
