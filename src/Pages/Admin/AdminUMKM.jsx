import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Phone, ExternalLink, RefreshCw, Store, AlertCircle, Filter, Mail } from "lucide-react"
import UMKMModal from "../../components/Admin/Modals/UMKMModal"
import { umkmService } from "../../Services/umkmService"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../Utils/sweetAlert"
import Pagination from "../../components/Admin/Pagination"
import LoadingSpinner from "../../components/Admin/LoadingSpinner"
import ErrorNotification from "../../components/Admin/ErrorNotification"
import ImageWithFallback from "../../components/Admin/ImageWithFallback"

const AdminUMKM = () => {
    const [umkms, setUmkms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUMKM, setSelectedUMKM] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [filterStatus, setFilterStatus] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [paginationMeta, setPaginationMeta] = useState({})


    const fetchUMKMs = async (page = 1, perPage = 6, search = "", filters = {}) => {
        try {
            setLoading(true)
            const response = await umkmService.getUMKMs(page, perPage, search, filters)
            if (response.data) {
                const transformed = response.data.map((u) => ({
                    ...u,
                    status: u.is_active ? "Aktif" : "Nonaktif",
                    createdAt: new Date(u.created_at).toISOString().split("T")[0],
                }))
                setUmkms(transformed)
                setPaginationMeta(response.meta)
                setCurrentPage(response.meta.current_page)
                setTotalPages(response.meta.last_page)
                setTotalItems(response.meta.total)
                setItemsPerPage(response.meta.per_page)
            }
        } catch (err) {
            setError(err.message || "Gagal memuat UMKM")
            showError("Gagal Memuat UMKM", err.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUMKMs(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemsPerPage])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
            fetchUMKMs(1, itemsPerPage, searchTerm, { is_active: filterStatus })
        }, 400)
        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, searchTerm])

    const handleEdit = (umkm) => {
        setSelectedUMKM(umkm)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedUMKM(null)
        setIsModalOpen(true)
    }

    const handleRefresh = () => {
        umkmService.clearUMKMCache();
        fetchUMKMs(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
    }

    // const handleDelete = async (id) => {
    //     const confirmed = confirm("Apakah Anda yakin ingin menghapus UMKM ini?")
    //     if (!confirmed) return
    //     try {
    //         showLoading("Menghapus data...")
    //         await umkmService.deleteUMKM(id)
    //         closeLoading()
    //         showSuccess("Berhasil", "UMKM berhasil dihapus")
    //         fetchUMKMs(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
    //     } catch (err) {
    //         closeLoading()
    //         showError("Gagal", err.message || "Gagal menghapus UMKM")
    //     }
    // }

    const handleSave = async (umkmData) => {
        try {
            if (selectedUMKM) {
                console.log("umkm data", umkmData);

                await umkmService.updateUmkm(selectedUMKM.id, umkmData)
            } else {
                console.log("product data", umkmData);

                await umkmService.createUmkm(umkmData)
            }

            setIsModalOpen(false)
            // Refresh the current page
            umkmService.clearUMKMCache();
            fetchUMKMs(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
        } catch (err) {
            setError(err.message || "Failed to save umkm. Please try again.")
            const resData = error?.response?.data
            const errorMsg = resData?.message || "Terjadi kesalahan saat menyimpan data UMKM"

            if (resData?.error) {
                // Gabungkan semua pesan error jadi satu string
                const validationMessages = Object.entries(resData.error)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n")

                showError(errorMsg, validationMessages)
            } else {
                showError("Gagal Menyimpan data UMKM", error.message || errorMsg)
            }
            console.error("Error saving data umkm:", err)
            throw err // Re-throw to let modal handle it
        }
    }

    const handleDelete = async (id, umkmName) => {
        try {
            const result = await showConfirmation(
                "Hapus UMKM?",
                `Apakah Anda yakin ingin menghapus "${umkmName}"? Tindakan ini tidak dapat dibatalkan.`,
                "Ya, Hapus!",
            )

            if (result.isConfirmed) {
                showLoading("Menghapus UMKM...")
                await umkmService.deleteUmkm(id)
                closeLoading()

                showSuccess("UMKM Berhasil Dihapus!", "UMKM telah dihapus dari sistem")

                // Refresh the current page
                umkmService.clearUMKMCache();
                fetchUMKMs(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
            }
        } catch (err) {
            closeLoading()
            setError(err.message || "Failed to delete umkm. Please try again.")
            showError("Gagal Menghapus UMKM", err.message || "Terjadi kesalahan saat menghapus UMKM")
            console.error("Error deleting umkm:", err)
        }
    }

    const handlePerPageChange = (newPerPage) => {
        setItemsPerPage(newPerPage)
        setCurrentPage(1) // Reset to first page
    }

    const handleFilterChange = (value) => {
        setCurrentPage(1) // Reset to first page when filtering
        setFilterStatus(value)
    }

    const handlePageChange = (page) => setCurrentPage(page)

    const clearFilters = () => {
        setSearchTerm("")
        // setFilterBrand("")
        // setFilterUMKM("")
        // setFilterCategory("")
        setFilterStatus("")
        setCurrentPage(1)
    }

    if (loading && umkms.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk</h2>
                        <p className="text-gray-600 mt-1">Kelola semua produk UMKM dalam satu tempat</p>
                    </div>
                </div>
                <LoadingSpinner text="Memuat umkm..." />
                <ErrorNotification />
            </div>
        )
    }

    return (
        <div>
            <div className="space-y-6">
                <ErrorNotification />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen UMKM</h2>
                        <p className="text-gray-600 mt-1">Kelola data UMKM yang terdaftar</p>
                        {paginationMeta.total && (
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {paginationMeta.total} UMKM | Halaman {paginationMeta.current_page} dari{" "}
                                {paginationMeta.last_page}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <button
                            onClick={handleAdd}
                            className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah UMKM
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                            ×
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">Filter & Pencarian</h3>
                        <button onClick={clearFilters} className="ml-auto text-sm text-blue-600 hover:text-blue-800">
                            Clear Filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama UMKM..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={filterStatus}
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={itemsPerPage}
                            onChange={(e) => handlePerPageChange(Number.parseInt(e.target.value))}
                        >
                            <option value={9}>9 per halaman</option>
                            <option value={18}>18 per halaman</option>
                            <option value={25}>25 per halaman</option>
                            <option value={50}>50 per halaman</option>
                        </select>
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading && umkms.length > 0 && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                <LoadingSpinner size="sm" text="Memuat..." />
                            </div>
                        )}
                        {umkms.length === 0 && !loading ? (
                            <div className="w-full text-center py-12 text-gray-500 md:col-span-2 xl:col-span-3">
                                <div className="flex flex-col items-center">
                                    <Search className="w-12 h-12 text-gray-300 mb-4" />
                                    <p className="text-lg font-medium">Tidak ada UMKM ditemukan</p>
                                    <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                                </div>
                            </div>
                        ) : umkms.map((umkm) => (
                            <div key={umkm.id} className="bg-white rounded-xl shadow-sm p-6">
                                {/* <img
                                    src={umkm.photo_profile_url || umkm.photo_profile}
                                    alt={umkm.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                /> */}
                                <ImageWithFallback
                                    srcs={[umkm.photo_profile_url, umkm.photo_profile]}
                                    alt={umkm.name}
                                    className="w-full h-72 object-cover rounded-lg mb-4"
                                    fallbackIcon={Store}
                                    sizeIconFallback={10}
                                />

                                <div className="mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{umkm.name}</h3>
                                    <p className="text-sm text-gray-600">{umkm.owner_name} &bull; {umkm.gender === "l" ? "Laki-laki" : "Perempuan"}</p>
                                    <p className="text-sm text-gray-500">NIK: {umkm.nik}</p>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-3 mb-2">{umkm.description}</p>

                                <div className="text-sm text-gray-600 mb-1 flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                                    <span className="line-clamp-2">{umkm.address}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1 flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span>{umkm.phone}</span>
                                </div>
                                <a
                                    href={`mailto:${umkm.email}`}
                                    className="text-sm text-blue-600 mb-1 flex items-center hover:underline"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span>{umkm.email}</span>
                                </a>

                                {umkm.wa_link && (
                                    <a href={umkm.wa_link} target="_blank" rel="noopener noreferrer" className="flex items-center mb-3 text-sm text-blue-600 hover:text-blue-800">
                                        <ExternalLink className="w-4 h-4 mr-1" /> WhatsApp
                                    </a>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className={`admin-status-badge ${umkm.is_active ? "bg-[#d1fae5] text-[#065f46]" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {umkm.is_active ? "Aktif" : "Nonaktif"}
                                    </span>
                                    <span className="text-xs text-gray-500">Sejak {new Date(umkm.created_at).toLocaleDateString("id-ID")}</span>
                                </div>

                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(umkm)} className="text-green-600 p-2 hover:bg-green-50 rounded-lg">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(umkm.id, umkm.name)} className="text-red-600 p-2 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                )}

            </div>
            <UMKMModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                umkm={selectedUMKM}
            />
        </div>
    )
}

export default AdminUMKM
