"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Calendar, Percent } from "lucide-react"
import PromoNewsModal from "../../components/Admin/Modals/PromoNewsModal"

const AdminPromoNews = () => {
  const [promoNews, setPromoNews] = useState([
    {
      id: 1,
      name: "Flash Sale Ramadan 2024",
      shortDescription: "Diskon hingga 50% untuk produk pilihan",
      fullDescription:
        "Dapatkan diskon fantastis hingga 50% untuk berbagai produk unggulan UMKM dalam rangka menyambut bulan suci Ramadan.",
      profileImage: "/placeholder.svg?height=200&width=300",
      descriptionImage: "/placeholder.svg?height=200&width=300",
      createdAt: "2024-03-01",
      endDate: "2024-03-31",
      promoProducts: ["Kopi Arabica Premium", "Batik Tulis Jogja"],
      discount: 50,
      status: "Aktif",
    },
    {
      id: 2,
      name: "Promo Hari Kemerdekaan",
      shortDescription: "Diskon spesial 17% untuk semua produk",
      fullDescription: "Rayakan hari kemerdekaan Indonesia dengan diskon spesial 17% untuk semua produk UMKM pilihan.",
      profileImage: "/placeholder.svg?height=200&width=300",
      descriptionImage: "/placeholder.svg?height=200&width=300",
      createdAt: "2024-08-01",
      endDate: "2024-08-31",
      promoProducts: ["Keripik Singkong Pedas"],
      discount: 17,
      status: "Aktif",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNews = promoNews.filter((news) => news.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEdit = (news) => {
    setSelectedNews(news)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedNews(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita promo ini?")) {
      setPromoNews(promoNews.filter((n) => n.id !== id))
    }
  }

  const handleSave = (newsData) => {
    if (selectedNews) {
      setPromoNews(promoNews.map((n) => (n.id === selectedNews.id ? { ...n, ...newsData } : n)))
    } else {
      const newNews = {
        id: Math.max(...promoNews.map((n) => n.id)) + 1,
        ...newsData,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Aktif",
      }
      setPromoNews([...promoNews, newNews])
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
          <h2 className="text-3xl font-bold text-gray-900">Berita Promo</h2>
          <p className="text-gray-600 mt-1">Kelola promosi dan diskon produk UMKM</p>
        </div>
        <button
          onClick={handleAdd}
          className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah Promo
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari promo..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full admin-input-focus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Promo Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNews.map((news) => (
          <div key={news.id} className="bg-white rounded-xl shadow-sm overflow-hidden admin-card-hover">
            <div className="relative">
              <img className="w-full h-48 object-cover" src={news.profileImage || "/placeholder.svg"} alt={news.name} />
              <div className="absolute top-4 left-4">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  {news.discount}% OFF
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <span
                  className={`admin-status-badge ${
                    isPromoActive(news.endDate) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {isPromoActive(news.endDate) ? "Aktif" : "Berakhir"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{news.shortDescription}</p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {news.createdAt} - {news.endDate}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Produk Promo:</span> {news.promoProducts.join(", ")}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(news)}
                  className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(news.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PromoNewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        news={selectedNews}
      />
    </div>
  )
}

export default AdminPromoNews
