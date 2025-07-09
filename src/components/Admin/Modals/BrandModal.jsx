"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const BrandModal = ({ isOpen, onClose, onSave, brand }) => {
  const [formData, setFormData] = useState({
    name: "",
    umkm: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        umkm: brand.umkm || "",
        description: brand.description || "",
        image: brand.image || "",
      })
    } else {
      setFormData({
        name: "",
        umkm: "",
        description: "",
        image: "",
      })
    }
  }, [brand])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{brand ? "Edit Brand" : "Tambah Brand"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Brand *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UMKM *</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.umkm}
              onChange={(e) => setFormData({ ...formData, umkm: e.target.value })}
            >
              <option value="">Pilih UMKM</option>
              <option value="CV. Berkah Jaya">CV. Berkah Jaya</option>
              <option value="UD. Seni Budaya">UD. Seni Budaya</option>
              <option value="PT. Kreatif Nusantara">PT. Kreatif Nusantara</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Brand</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto Profil</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
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
              {brand ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BrandModal
