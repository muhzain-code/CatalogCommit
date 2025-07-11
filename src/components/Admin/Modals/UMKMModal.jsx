/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { closeLoading, showError, showLoading, showSuccess } from "../../../Utils/sweetAlert"

const UMKMModal = ({ isOpen, onClose, onSave, umkm }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        owner_name: "",
        nik: "",
        gender: "l",
        description: "",
        address: "",
        phone: "",
        email: "",
        wa_link: "",
        is_active: true,
        photo_profile: null, // file upload
    })

    useEffect(() => {
        if (umkm) {
            setFormData({
                name: umkm.name || "",
                owner_name: umkm.owner_name || "",
                nik: umkm.nik || "",
                gender: umkm.gender || "l",
                description: umkm.description || "",
                address: umkm.address || "",
                phone: umkm.phone || "",
                email: umkm.email || "",
                wa_link: umkm.wa_link || "",
                is_active: umkm.is_active ?? true,
                photo_profile: null, // reset file input
            })
        } else {
            setFormData({
                name: "",
                owner_name: "",
                nik: "",
                gender: "l",
                description: "",
                address: "",
                phone: "",
                email: "",
                wa_link: "",
                is_active: true,
                photo_profile: null,
            })
        }
    }, [umkm])

    const handleSubmit = async (e) => {
        e.preventDefault()


        setLoading(true)
        showLoading(umkm ? "Mengupdate produk..." : "Menyimpan produk...")

        try {
            const payload = {
                ...formData,
                is_active: formData.is_active ? 1 : 0, // Convert boolean to 1/0
            }
            if (!(formData.photo_profile instanceof File)) {
                delete payload.photo_profile
            }
            await onSave(payload)
            closeLoading()
            showSuccess(
                umkm ? "UMKM Berhasil Diupdate!" : "UMKM Berhasil Disimpan!",
                umkm ? "Data UMKM telah diperbarui" : "UMKM baru telah ditambahkan",
            )
        } catch (error) {
            closeLoading()

            console.log("DETAIL ERROR:", error)

            const validationErrors = error?.originalError?.responseData?.error

            if (validationErrors) {
                const messages = Object.values(validationErrors).flat().join("\n")
                showError("Validasi Gagal", messages)
            } else {
                showError("Gagal Menyimpan", error.message || "Terjadi kesalahan.")
            }
        }
        finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo_profile: e.target.files[0] })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{umkm ? "Edit UMKM" : "Tambah UMKM"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama UMKM */}
                    <InputField label="Nama UMKM *" required maxLength={100} value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} disabled={loading} />

                    {/* Nama Pemilik */}
                    <InputField label="Nama Pemilik *" required maxLength={100} value={formData.owner_name} onChange={(v) => setFormData({ ...formData, owner_name: v })} disabled={loading} />

                    {/* NIK */}
                    <InputField label="NIK *" required maxLength={16} pattern="\d{16}" value={formData.nik} onChange={(v) => setFormData({ ...formData, nik: v })} disabled={loading} />

                    {/* Jenis Kelamin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin *</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="l">Laki-laki</option>
                            <option value="p">Perempuan</option>
                        </select>
                    </div>

                    {/* Deskripsi */}
                    <TextareaField label="Deskripsi" rows={3} value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} className="md:col-span-2" disabled={loading} />

                    {/* Alamat */}
                    <TextareaField label="Alamat Lengkap *" rows={3} required value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} className="md:col-span-2" disabled={loading} />

                    {/* No HP */}
                    <InputField label="No. HP *" required maxLength={20} value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} disabled={loading} />

                    {/* Email */}
                    <InputField label="Email" type="email" maxLength={255} value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} disabled={loading} />

                    {/* WA Link */}
                    <InputField label="Link WhatsApp" type="url" maxLength={255} value={formData.wa_link} onChange={(v) => setFormData({ ...formData, wa_link: v })} disabled={loading} />

                    {/* Photo Profile */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profile (max 2MB)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={loading}
                        />
                    </div>

                    {/* Aktif */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4"
                            disabled={loading}
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300" disabled={loading}>Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={loading}>
                            {loading ? "Menyimpan..." : umkm ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default UMKMModal

// Helper Input
const InputField = ({ label, value, onChange, type = "text", ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            {...props}
        />
    </div>
)

const TextareaField = ({ label, value, onChange, className, ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            {...props}
            placeholder={label}
        />
    </div>
)
