"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react"
import BrandModal from "../../components/Admin/Modals/BrandModal"

const AdminBrands = () => {
  const [brands, setBrands] = useState([
    {
      id: 1,
      name: "Kopi Nusantara",
      umkm: "CV. Berkah Jaya",
      description: "Brand kopi premium dari petani lokal dengan kualitas terbaik",
      status: "Aktif",
      image: "/placeholder.svg?height=60&width=60",
      productCount: 15,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Batik Heritage",
      umkm: "UD. Seni Budaya",
      description: "Batik tulis tradisional dengan motif modern dan berkualitas tinggi",
      status: "Aktif",
      image: "/placeholder.svg?height=60&width=60",
      productCount: 8,
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "Snack Tradisional",
      umkm: "UD. Berkah Rasa",
      description: "Camilan tradisional dengan cita rasa autentik nusantara",
      status: "Aktif",
      image: "/placeholder.svg?height=60&width=60",
      productCount: 12,
      createdAt: "2024-01-12",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.umkm.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (brand) => {
    setSelectedBrand(brand)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedBrand(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus brand ini?")) {
      setBrands(brands.filter((b) => b.id !== id))
    }
  }

  const handleSave = (brandData) => {
    if (selectedBrand) {
      setBrands(brands.map((b) => (b.id === selectedBrand.id ? { ...b, ...brandData } : b)))
    } else {
      const newBrand = {
        id: Math.max(...brands.map((b) => b.id)) + 1,
        ...brandData,
        status: "Aktif",
        productCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setBrands([...brands, newBrand])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen Brand</h2>
          <p className="text-gray-600 mt-1">Kelola brand produk UMKM</p>
        </div>
        <button
          onClick={handleAdd}
          className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah Brand
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari brand atau UMKM..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full admin-input-focus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-xl shadow-sm p-6 admin-card-hover">
            <div className="flex items-start justify-between mb-4">
              <img
                className="h-16 w-16 rounded-xl object-cover shadow-sm"
                src={brand.image || "/placeholder.svg"}
                alt={brand.name}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>

            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Building2 className="w-4 h-4 mr-1" />
              {brand.umkm}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.description}</p>

            <div className="flex items-center justify-between">
              <span
                className={`admin-status-badge ${
                  brand.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {brand.status}
              </span>
              <span className="text-sm text-gray-500">{brand.productCount} produk</span>
            </div>
          </div>
        ))}
      </div>

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        brand={selectedBrand}
      />
    </div>
  )
}

export default AdminBrands
