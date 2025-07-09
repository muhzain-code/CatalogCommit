"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Phone } from "lucide-react"
import UMKMModal from "../../components/Admin/Modals/UMKMModal"

const AdminUMKM = () => {
  const [umkmList, setUmkmList] = useState([
    {
      id: 1,
      name: "CV. Berkah Jaya",
      address: "Jl. Merdeka No. 123, Jakarta Selatan",
      phone: "081234567890",
      status: "Aktif",
      brandCount: 2,
      productCount: 15,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "UD. Seni Budaya",
      address: "Jl. Malioboro No. 45, Yogyakarta",
      phone: "081234567891",
      status: "Aktif",
      brandCount: 1,
      productCount: 8,
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "UD. Berkah Rasa",
      address: "Jl. Sudirman No. 78, Surabaya",
      phone: "081234567892",
      status: "Aktif",
      brandCount: 1,
      productCount: 12,
      createdAt: "2024-01-12",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUMKM, setSelectedUMKM] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUMKM = umkmList.filter(
    (umkm) =>
      umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (umkm) => {
    setSelectedUMKM(umkm)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedUMKM(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus UMKM ini?")) {
      setUmkmList(umkmList.filter((u) => u.id !== id))
    }
  }

  const handleSave = (umkmData) => {
    if (selectedUMKM) {
      setUmkmList(umkmList.map((u) => (u.id === selectedUMKM.id ? { ...u, ...umkmData } : u)))
    } else {
      const newUMKM = {
        id: Math.max(...umkmList.map((u) => u.id)) + 1,
        ...umkmData,
        status: "Aktif",
        brandCount: 0,
        productCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUmkmList([...umkmList, newUMKM])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen UMKM</h2>
          <p className="text-gray-600 mt-1">Kelola data UMKM yang terdaftar</p>
        </div>
        <button
          onClick={handleAdd}
          className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah UMKM
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari UMKM atau alamat..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full admin-input-focus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* UMKM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUMKM.map((umkm) => (
          <div key={umkm.id} className="bg-white rounded-xl shadow-sm p-6 admin-card-hover">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{umkm.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(umkm)}
                  className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(umkm.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{umkm.address}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>{umkm.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span
                className={`admin-status-badge ${
                  umkm.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {umkm.status}
              </span>
              <span className="text-xs text-gray-500">Sejak {umkm.createdAt}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{umkm.brandCount}</div>
                <div className="text-xs text-gray-500">Brand</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{umkm.productCount}</div>
                <div className="text-xs text-gray-500">Produk</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UMKMModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} umkm={selectedUMKM} />
    </div>
  )
}

export default AdminUMKM
