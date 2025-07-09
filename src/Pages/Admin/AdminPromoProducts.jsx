"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Percent, Calendar } from "lucide-react"
import PromoProductModal from "../../components/Admin/Modals/PromoProductModal"

const AdminPromoProducts = () => {
  const [promoProducts, setPromoProducts] = useState([
    {
      id: 1,
      name: "Promo Kopi Spesial",
      product: "Kopi Arabica Premium",
      originalPrice: 85000,
      promoPrice: 65000,
      discount: 24,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      description: "Promo spesial untuk kopi arabica premium dengan kualitas terbaik",
      image: "/placeholder.svg?height=60&width=60",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Flash Sale Batik",
      product: "Batik Tulis Jogja",
      originalPrice: 250000,
      promoPrice: 200000,
      discount: 20,
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      description: "Flash sale untuk batik tulis jogja dengan motif eksklusif",
      image: "/placeholder.svg?height=60&width=60",
      status: "Aktif",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPromos = promoProducts.filter(
    (promo) =>
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.product.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (promo) => {
    setSelectedPromo(promo)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedPromo(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus promo produk ini?")) {
      setPromoProducts(promoProducts.filter((p) => p.id !== id))
    }
  }

  const handleSave = (promoData) => {
    if (selectedPromo) {
      setPromoProducts(promoProducts.map((p) => (p.id === selectedPromo.id ? { ...p, ...promoData } : p)))
    } else {
      const newPromo = {
        id: Math.max(...promoProducts.map((p) => p.id)) + 1,
        ...promoData,
        status: "Aktif",
      }
      setPromoProducts([...promoProducts, newPromo])
    }
    setIsModalOpen(false)
  }

  const isPromoActive = (endDate) => {
    return new Date(endDate) >= new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Produk Promo</h2>
          <p className="text-gray-600 mt-1">Kelola promo untuk produk tertentu</p>
        </div>
        <button
          onClick={handleAdd}
          className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah Promo Produk
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari promo atau produk..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full admin-input-focus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Promo Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promo & Produk
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diskon
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromos.map((promo) => (
                <tr key={promo.id} className="admin-table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover shadow-sm"
                        src={promo.image || "/placeholder.svg"}
                        alt={promo.product}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                        <div className="text-sm text-gray-500">{promo.product}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="line-through text-gray-500">Rp {promo.originalPrice.toLocaleString("id-ID")}</div>
                      <div className="font-semibold text-red-600">Rp {promo.promoPrice.toLocaleString("id-ID")}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-sm font-semibold text-red-600">{promo.discount}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {promo.startDate}
                      </div>
                      <div className="text-gray-500">s/d {promo.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`admin-status-badge ${
                        isPromoActive(promo.endDate) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isPromoActive(promo.endDate) ? "Aktif" : "Berakhir"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PromoProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        promo={selectedPromo}
      />
    </div>
  )
}

export default AdminPromoProducts
