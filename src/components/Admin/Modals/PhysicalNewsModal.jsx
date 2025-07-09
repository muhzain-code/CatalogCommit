"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const PhysicalNewsModal = ({ isOpen, onClose, onSave, news }) => {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    profileImage: "",
    descriptionImage: "",
    endDate: "",
    involvedUMKM: [],
  })

  const availableUMKM = ["CV. Berkah Jaya", "UD. Seni Budaya", "PT. Kreatif Nusantara"]

  useEffect(() => {
    if (news) {
      setFormData({
        name: news.name || "",
        shortDescription: news.shortDescription || "",
        fullDescription: news.fullDescription || "",
        profileImage: news.profileImage || "",
        descriptionImage: news.descriptionImage || "",
        endDate: news.endDate || "",
        involvedUMKM: news.involvedUMKM || [],
      })
    } else {
      setFormData({
        name: "",
        shortDescription: "",
        fullDescription: "",
        profileImage: "",
        descriptionImage: "",
        endDate: "",
        involvedUMKM: [],
      })
    }
  }, [news])

  const handleUMKMChange = (umkm, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        involvedUMKM: [...formData.involvedUMKM, umkm],
      })
    } else {
      setFormData({
        ...formData,
        involvedUMKM: formData.involvedUMKM.filter((u) => u !== umkm),
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{news ? "Edit Berita Fisik" : "Tambah Berita Fisik"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Event *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat *</label>
            <textarea
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap *</label>
            <textarea
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto Profil</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto Deskripsi</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.descriptionImage}
                onChange={(e) => setFormData({ ...formData, descriptionImage: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UMKM Terlibat</label>
            <div className="space-y-2">
              {availableUMKM.map((umkm) => (
                <label key={umkm} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.involvedUMKM.includes(umkm)}
                    onChange={(e) => handleUMKMChange(umkm, e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-900">{umkm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {news ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PhysicalNewsModal
