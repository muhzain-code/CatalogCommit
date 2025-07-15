"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Phone, ExternalLink, Upload, Trash2, Plus } from "lucide-react"
import ImageWithFallback from "../ImageWithFallback"
import { umkmService } from "../../../Services/umkmService"
import { categoryService } from "../../../Services/categoryService"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../../Utils/sweetAlert"

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        // shipping_price: "",
        // free_shipping: false,
        status: "available",
        umkm_id: "",
        category_id: "",
        // date: "",
        photos: [],
        marketplaces: [],
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [umkms, setUmkms] = useState([])
    const [categories, setCategories] = useState([])
    const [loadingOptions, setLoadingOptions] = useState(true)

    // Load UMKM and Categories on mount
    useEffect(() => {
        if (isOpen) {
            loadOptions()
        }
    }, [isOpen])

    const loadOptions = async () => {
        try {
            setLoadingOptions(true)
            const [umkmResponse, categoryResponse] = await Promise.all([
                umkmService.getUMKMs(),
                categoryService.getCategories(),
            ])

            setUmkms(umkmResponse.data || [])
            setCategories(categoryResponse.data || [])
        } catch (error) {
            console.error("Error loading options:", error)
            showError("Gagal Memuat Data", "Tidak dapat memuat data UMKM dan kategori")
        } finally {
            setLoadingOptions(false)
        }
    }

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "",
                // shipping_price: product.shipping_price?.toString() || "",
                // free_shipping: product.free_shipping || false,
                status: product.status || "available",
                umkm_id: product.umkm_id?.toString() || "",
                category_id: product.category_id?.toString() || "",
                // date: product.date || "",
                photos:
                    product.photos?.map((photo) => ({
                        id: photo.id,
                        photo_type_id: photo.photo_type_id || "",
                        file_path: photo.file_path || "",
                        is_active: photo.is_active ? 1 : 0,
                        preview: null,
                    })) || [],
                marketplaces: product.marketplaces?.map(m => ({
                    name: m.name || "",
                    price: m.price?.toString() || "",
                    marketplace_link: m.marketplace_link || "",
                    is_active: m.is_active ?? true,
                })) || [{ name: "", price: "", marketplace_link: "", is_active: true }],
            })
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                // shipping_price: "",
                // free_shipping: false,
                status: "available",
                umkm_id: "",
                category_id: "",
                // date: new Date().toISOString().split("T")[0],
                photos: [{
                    file_path: "",
                    is_active: 1,
                    photo_type_id: 1,
                }],
                marketplaces: [],
            })
        }
        setErrors({})
    }, [product, isOpen])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handlePhotoChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos.map((photo, i) => (i === index ? { ...photo, [field]: value } : photo)),
        }))
    }

    const addPhoto = () => {
        if (formData.photos.length < 5) {
            const newIndex = formData.photos.length;
            // const newCaption = `Photo ${newIndex}`;

            setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, {
                    // caption: newCaption,
                    photo_type_id: newIndex === 0 ? 1 : 2,
                    file_path: "",
                    is_active: 1,
                    preview: null, 
                }],
            }));
        }
    }

    const removePhoto = (index) => {
        setFormData((prev) => {
            const newPhotos = prev.photos.filter((_, i) => i !== index)
                .map((photo, i) => ({
                    ...photo,
                    photo_type_id: i === 0 ? 1 : 2,
                }));
            return {
                ...prev,
                photos: newPhotos,
            };
        });
    }

    const handleFileUpload = (index, file) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            console.log("File dipilih:", file);
        console.log("Preview URL:", previewUrl);

            handlePhotoChange(index, "file", file)
            handlePhotoChange(index, "preview", previewUrl)
        }
    }

    const handleMarketplaceChange = (index, field, value) => {
        setFormData((prev) => {
            const updated = [...prev.marketplaces];
            updated[index][field] = value;
            return { ...prev, marketplaces: updated };
        });
    };

    const addMarketplace = () => {
        setFormData((prev) => ({
            ...prev,
            marketplaces: [
                ...prev.marketplaces,
                { name: "", price: "", marketplace_link: "", is_active: true },
            ],
        }));
    };

    const removeMarketplace = (index) => {
        setFormData((prev) => ({
            ...prev,
            marketplaces: prev.marketplaces.filter((_, i) => i !== index),
        }));
    };


    const validateForm = () => {
        const newErrors = {}

        // Required fields
        if (!formData.name.trim()) {
            newErrors.name = "Nama produk harus diisi"
        } else if (formData.name.length > 100) {
            newErrors.name = "Nama produk maksimal 100 karakter"
        }

        if (!formData.price || Number.parseFloat(formData.price) < 0) {
            newErrors.price = "Harga harus diisi dan tidak boleh negatif"
        }

        if (!formData.umkm_id) {
            newErrors.umkm_id = "UMKM harus dipilih"
        }

        if (!formData.category_id) {
            newErrors.category_id = "Kategori harus dipilih"
        }

        if (!formData.status) {
            newErrors.status = "Status harus dipilih"
        }

        // Shipping price validation
        if (!formData.free_shipping && formData.shipping_price && Number.parseFloat(formData.shipping_price) < 0) {
            newErrors.shipping_price = "Biaya pengiriman tidak boleh negatif"
        }

        if (!formData.photos[0]?.file && !formData.photos[0]?.file_path) {
            newErrors.photos = "Foto utama wajib diunggah"
        }

        // Photos validation (max 5)
        if (formData.photos.length > 5) {
            newErrors.photos = "Maksimal 5 foto dapat diunggah"
        }

        // Validate each photo
        formData.photos.forEach((photo, index) => {
            // if (photo.caption && photo.caption.length > 255) {
            //     newErrors[`photos.${index}.caption`] = "Caption maksimal 255 karakter"
            // }
            if (photo.file_path && photo.file_path.length > 255) {
                newErrors[`photos.${index}.file_path`] = "File path maksimal 255 karakter"
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            showError("Validasi Gagal", "Mohon periksa kembali data yang diisi")
            return
        }

        const result = await showConfirmation(
            product ? "Update Produk?" : "Simpan Produk?",
            product
                ? "Apakah Anda yakin ingin memperbarui data produk ini?"
                : "Apakah Anda yakin ingin menyimpan produk baru?",
            product ? "Ya, Update!" : "Ya, Simpan!"
        );

        if (!result.isConfirmed) return;

        setLoading(true)
        showLoading(product ? "Mengupdate produk..." : "Menyimpan produk...")

        try {
            // console.log(parseInt(formData.price));

            const submitData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: Math.round(Number(formData.price)),
                shipping_price: formData.free_shipping
                    ? null
                    : formData.shipping_price
                        ? Number.parseInt(formData.shipping_price)
                        : null,
                free_shipping: formData.free_shipping,
                status: formData.status,
                umkm_id: Number.parseInt(formData.umkm_id),
                category_id: Number.parseInt(formData.category_id),
                date: formData.date,
                photos: formData.photos.map((photo) => ({
                    photo_type_id: photo.photo_type_id || null,
                    file_path: photo.file_path || null,
                    is_active: photo.is_active || 1,
                    ...(photo.file && { file: photo.file }),
                })),
                marketplaces: formData.marketplaces.map(mp => ({
                    name: mp.name,
                    price: parseInt(mp.price),
                    marketplace_link: mp.marketplace_link,
                    is_active: !!mp.is_active,
                })),
            }

            // console.log("submit data", submitData);


            await onSave(submitData)
            closeLoading()
            showSuccess(
                product ? "Produk Berhasil Diupdate!" : "Produk Berhasil Disimpan!",
                product ? "Data produk telah diperbarui" : "Produk baru telah ditambahkan",
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
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">{product ? "Edit Produk" : "Tambah Produk Baru"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            maxLength={100}
                                            className={`w-full px-4 py-2 border rounded-lg admin-input-focus ${errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Masukkan nama produk (max 100 karakter)"
                                            disabled={loading}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                                            placeholder="Masukkan deskripsi produk"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">UMKM *</label>
                                            <select
                                                name="umkm_id"
                                                value={formData.umkm_id}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg admin-input-focus ${errors.umkm_id ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                disabled={loading || loadingOptions}
                                            >
                                                <option value="">Pilih UMKM</option>
                                                {umkms.map((umkm) => (
                                                    <option key={umkm.id} value={umkm.id}>
                                                        {umkm.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.umkm_id && <p className="text-red-500 text-sm mt-1">{errors.umkm_id}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg admin-input-focus ${errors.category_id ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                disabled={loading || loadingOptions}
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Harga</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Harga Produk (Rp) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className={`w-full px-4 py-2 border rounded-lg admin-input-focus ${errors.price ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="0"
                                            disabled={loading}
                                        />
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                    </div>

                                    {/* <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name="free_shipping"
                                            checked={formData.free_shipping}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                        <label className="text-sm font-medium text-gray-700">Gratis Ongkir</label>
                                    </div>

                                    {!formData.free_shipping && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Pengiriman (Rp)</label>
                                            <input
                                                type="number"
                                                name="shipping_price"
                                                value={formData.shipping_price}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                className={`w-full px-4 py-2 border rounded-lg admin-input-focus ${errors.shipping_price ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                placeholder="0"
                                                disabled={loading}
                                            />
                                            {errors.shipping_price && <p className="text-red-500 text-sm mt-1">{errors.shipping_price}</p>}
                                        </div>
                                    )} */}
                                </div>
                            </div>

                            {/* Status and Date */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status Produk *</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg admin-input-focus ${errors.status ? "border-red-500" : "border-gray-300"
                                                }`}
                                            disabled={loading}
                                        >
                                            <option value="available">Tersedia</option>
                                            <option value="pre_order">Pre Order</option>
                                            <option value="inactive">Nonaktif</option>
                                        </select>
                                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                    </div>

                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                                            disabled={loading}
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Marketplace Section */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Marketplace</h3>
                                    <button
                                        type="button"
                                        onClick={addMarketplace}
                                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Tambah Marketplace
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.marketplaces.map((mp, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900">Marketplace {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMarketplace(index)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Marketplace</label>
                                                    <input
                                                        type="text"
                                                        value={mp.name}
                                                        onChange={(e) => handleMarketplaceChange(index, "name", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm admin-input-focus"
                                                        placeholder="Shopee, Tokopedia, dll"
                                                        disabled={loading}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Harga (Rp)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={mp.price}
                                                        onChange={(e) => handleMarketplaceChange(index, "price", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm admin-input-focus"
                                                        placeholder="Contoh: 20000"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">Link Marketplace</label>
                                                <input
                                                    type="text"
                                                    value={mp.marketplace_link}
                                                    onChange={(e) => handleMarketplaceChange(index, "marketplace_link", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm admin-input-focus"
                                                    placeholder="https://..."
                                                    disabled={loading}
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={mp.is_active}
                                                    onChange={(e) => handleMarketplaceChange(index, "is_active", e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    disabled={loading}
                                                />
                                                <label className="ml-2 text-sm text-gray-700">Aktif</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Photos */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Foto Produk</h3>
                                    <button
                                        type="button"
                                        onClick={addPhoto}
                                        disabled={formData.photos.length >= 5 || loading}
                                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Tambah Foto
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.photos.map((photo, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900">{index === 0 ? "📌 Foto Utama" : `🖼️ Foto Gallery ${index}`}</h4>
                                                {index != 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="text-red-600 hover:text-red-800 p-1"
                                                        disabled={loading || index == 0}
                                                        title={index === 0 ? "Foto utama tidak bisa dihapus" : "Hapus foto"}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                                                    <input
                                                        type="text"
                                                        value={photo.caption}
                                                        onChange={(e) => handlePhotoChange(index, "caption", e.target.value)}
                                                        maxLength={255}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm admin-input-focus"
                                                        placeholder="Caption foto (opsional)"
                                                        disabled={loading}
                                                    />
                                                    {errors[`photos.${index}.caption`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`photos.${index}.caption`]}</p>
                                                    )}
                                                </div> */}

                                                {/* <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">File Path</label>
                                                    <input
                                                        type="text"
                                                        value={photo.file_path}
                                                        onChange={(e) => handlePhotoChange(index, "file_path", e.target.value)}
                                                        maxLength={255}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm admin-input-focus"
                                                        placeholder="URL atau path file"
                                                        disabled={loading}
                                                    />
                                                    {errors[`photos.${index}.file_path`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`photos.${index}.file_path`]}</p>
                                                    )}
                                                </div> */}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={photo.is_active === 1}
                                                        onChange={(e) => handlePhotoChange(index, "is_active", e.target.checked ? 1 : 0)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        disabled={loading}
                                                    />
                                                    <label className="ml-2 text-sm text-gray-700">Aktif</label>
                                                </div>

                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                                    className="text-sm text-gray-500"
                                                    disabled={loading}
                                                    required={index == 0}
                                                />
                                            </div>

                                            {(photo.preview || photo.file_path || photo.url) && (
                                                <div className="mt-3">
                                                    <ImageWithFallback
                                                        src={photo.preview || photo.file_path || photo.url}
                                                        alt={photo.caption || `Foto ${index + 1}`}
                                                        className="w-full h-60 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {formData.photos.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>Belum ada foto yang ditambahkan</p>
                                            <p className="text-sm">Klik Tambah Foto untuk menambahkan foto produk</p>
                                        </div>
                                    )}

                                    {formData.photos.length > 0 && (
                                        <p className="text-sm text-gray-500 text-center">
                                            {formData.photos.length}/5 foto telah ditambahkan
                                        </p>
                                    )}
                                </div>

                                {errors.photos && <p className="text-red-500 text-sm mt-2">{errors.photos}</p>}
                            </div>

                            {/* Product Information Display (if editing) */}
                            {product && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi UMKM</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">{product.umkm?.address || "Alamat tidak tersedia"}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">{product.umkm?.phone || "Telepon tidak tersedia"}</span>
                                        </div>

                                        {product.umkm?.wa_link && (
                                            <div className="flex items-center gap-2">
                                                <ExternalLink className="w-4 h-4 text-gray-500" />
                                                <a
                                                    href={product.umkm.wa_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    WhatsApp
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end space-x-4 pt-4 px-6 pb-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="admin-button-primary text-white px-6 py-2 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Menyimpan..." : product ? "Update Produk" : "Simpan Produk"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
