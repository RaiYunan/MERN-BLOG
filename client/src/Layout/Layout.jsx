import AppSideBar from '@/components/AppSideBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    //topbar
    //sidebar
    <SidebarProvider>
        <AppSideBar>
            <main>
            <Outlet/>
            {/* Footer */}
            </main>

        </AppSideBar>
         

    </SidebarProvider>
  
  )
}

export default Layout
