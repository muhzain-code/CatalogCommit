"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import CategoryModal from "../../components/Admin/Modals/CategoryModal"

const AdminCategories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Minuman",
      status: "Aktif",
      image: "https://cdn.rri.co.id/berita/Meulaboh/o/1730697035163-mx7r985czkpx5n8/zmbbcozyx5vici2.avif",
      productCount: 15,
      description: "Berbagai jenis minuman tradisional dan modern",
    },
    {
      id: 2,
      name: "Fashion",
      status: "Aktif",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmdcN0otz6Vv3D8rWNkA2k3fFwMlpC8k9SKg&s",
      productCount: 8,
      description: "Pakaian dan aksesoris fashion",
    },
    {
      id: 3,
      name: "Makanan",
      status: "Aktif",
      image: "https://res.cloudinary.com/dk0z4ums3/image/upload/v1733967095/attached_image/7-makanan-korea-yang-menyehatkan-cocok-di-lidah-lokal.jpg",
      productCount: 12,
      description: "Makanan ringan dan berat tradisional",
    },
    {
      id: 4,
      name: "Kerajinan",
      status: "Aktif",
      image: "data:image/jpeg;base64,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",
      productCount: 6,
      description: "Kerajinan tangan dan seni tradisional",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  const handleSave = (categoryData) => {
    if (selectedCategory) {
      setCategories(categories.map((c) => (c.id === selectedCategory.id ? { ...c, ...categoryData } : c)))
    } else {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        ...categoryData,
        status: "Aktif",
        productCount: 0,
      }
      setCategories([...categories, newCategory])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen Kategori</h2>
          <p className="text-gray-600 mt-1">Kelola kategori produk UMKM</p>
        </div>
        <button
          onClick={handleAdd}
          className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari kategori..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full admin-input-focus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm p-6 admin-card-hover">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <img
                  className="h-20 w-20 rounded-xl object-cover shadow-sm"
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                />
                <div className="absolute -top-2 -right-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {category.productCount}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{category.name}</h3>

            <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">{category.description}</p>

            <div className="flex justify-center mb-4">
              <span
                className={`admin-status-badge ${
                  category.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {category.status}
              </span>
            </div>

            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
      />
    </div>
  )
}

export default AdminCategories
