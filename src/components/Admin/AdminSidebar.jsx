"use client"

import { Link, useLocation } from "react-router-dom"
import { ShoppingBag, Tag, Building2, FolderOpen, Newspaper, Megaphone, Gift, Home, LogOut, X } from "lucide-react"

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const menuItems = [
    { path: "/admin", name: "Dashboard", icon: Home },
    { path: "/admin/products", name: "Produk", icon: ShoppingBag },
    { path: "/admin/brands", name: "Brand", icon: Tag },
    { path: "/admin/umkm", name: "UMKM", icon: Building2 },
    { path: "/admin/categories", name: "Kategori", icon: FolderOpen },
    { path: "/admin/physical-news", name: "Berita Fisik", icon: Newspaper },
    { path: "/admin/promo-news", name: "Berita Promo", icon: Megaphone },
    { path: "/admin/promo-products", name: "Produk Promo", icon: Gift },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-20 admin-mobile-backdrop lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl admin-sidebar-transition lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-white text-lg font-bold">e-Katalog Admin</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-800 p-1 rounded-lg lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname == item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "admin-sidebar-active shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4 mr-3" />
              Kembali ke Website
            </Link>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4 mr-3" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
