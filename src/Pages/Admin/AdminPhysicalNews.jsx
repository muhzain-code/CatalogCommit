"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Calendar, MapPin } from "lucide-react"
import PhysicalNewsModal from "../../components/Admin/Modals/PhysicalNewsModal"

const AdminPhysicalNews = () => {
  const [physicalNews, setPhysicalNews] = useState([
    {
      id: 1,
      name: "Pameran UMKM Jakarta 2024",
      shortDescription: "Pameran produk UMKM terbesar di Jakarta",
      fullDescription:
        "Pameran ini menampilkan berbagai produk unggulan dari UMKM se-Jakarta dengan berbagai kategori mulai dari makanan, fashion, hingga kerajinan tangan.",
      profileImage: "/placeholder.svg?height=200&width=300",
      descriptionImage: "/placeholder.svg?height=200&width=300",
      createdAt: "2024-01-15",
      endDate: "2024-02-15",
      location: "Jakarta Convention Center",
      involvedUMKM: ["CV. Berkah Jaya", "UD. Seni Budaya"],
      status: "Aktif",
    },
    {
      id: 2,
      name: "Festival Kuliner Nusantara",
      shortDescription: "Festival kuliner tradisional Indonesia",
      fullDescription:
        "Festival yang menampilkan berbagai kuliner tradisional dari seluruh nusantara dengan partisipasi UMKM kuliner terbaik.",
      profileImage: "/placeholder.svg?height=200&width=300",
      descriptionImage: "/placeholder.svg?height=200&width=300",
      createdAt: "2024-02-01",
      endDate: "2024-02-28",
      location: "Taman Mini Indonesia Indah",
      involvedUMKM: ["UD. Berkah Rasa"],
      status: "Aktif",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNews = physicalNews.filter(
    (news) =>
      news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (news) => {
    setSelectedNews(news)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedNews(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      setPhysicalNews(physicalNews.filter((n) => n.id !== id))
    }
  }

  const handleSave = (newsData) => {
    if (selectedNews) {
      setPhysicalNews(physicalNews.map((n) => (n.id === selectedNews.id ? { ...n, ...newsData } : n)))
    } else {
      const newNews = {
        id: Math.max(...physicalNews.map((n) => n.id)) + 1,
        ...newsData,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Aktif",
      }
      setPhysicalNews([...physicalNews, newNews])
    }
    setIsModalOpen(false)
  }

  const isEventActive = (endDate) => {
    return new Date(endDate) >= new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Berita Fisik</h2>
          <p className="text-gray-600 mt-1">Kelola event dan pameran UMKM</p>
        </div>
        <button
          onClick={handleAdd}
          className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah Event
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari event atau lokasi..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full admin-input-focus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNews.map((news) => (
          <div key={news.id} className="bg-white rounded-xl shadow-sm overflow-hidden admin-card-hover">
            <div className="relative">
              <img className="w-full h-48 object-cover" src={news.profileImage || "/placeholder.svg"} alt={news.name} />
              <div className="absolute top-4 right-4">
                <span
                  className={`admin-status-badge ${
                    isEventActive(news.endDate) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {isEventActive(news.endDate) ? "Aktif" : "Berakhir"}
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
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{news.location}</span>
                </div>
                <div>
                  <span className="font-medium">UMKM Terlibat:</span> {news.involvedUMKM.join(", ")}
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

      <PhysicalNewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        news={selectedNews}
      />
    </div>
  )
}

export default AdminPhysicalNews
