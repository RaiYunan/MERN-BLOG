import AppSideBar from "@/components/AppSideBar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AppSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300 ease-in-out">
        {/* Topbar */}
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Content */}
        <main className="flex-1 px-4 md:px-8 py-6 mt-16 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer className="w-full" />
      </div>
    </div>
  );
};

export default Layout;
