"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import AdminSidebar from "../../components/Admin/AdminSidebar"
import AdminHeader from "../../components/Admin/Header"

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen bg-gray-50">

      <AdminSidebar 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <AdminHeader 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
