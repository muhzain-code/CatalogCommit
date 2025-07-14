"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, Filter, AlertCircle, RefreshCw } from "lucide-react"
import ApplicationsModal from "../../components/Admin/Modals/ApplicationsModal"
import Pagination from "../../components/Admin/Pagination"
import LoadingSpinner from "../../components/Admin/LoadingSpinner"
import ErrorNotification from "../../components/Admin/ErrorNotification"
import { applicationsService } from "../../Services/applicationsService"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../Utils/sweetAlert"

const AdminApplications = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedApplications, setSelectedApplications] = useState(null)

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("")
    // const [filterUMKM, setFilterUMKM] = useState("")
    // const [filterStatus, setFilterStatus] = useState("")
    // const [filterEvent, setFilterEvent] = useState("")

    // Pagination states from API meta
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [paginationMeta, setPaginationMeta] = useState({})

    // Available filter options
    // const [filterOptions, setFilterOptions] = useState({
    //     // brands: [],
    //     umkms: [],
    //     events: [],
    // })

    // Fetch applications from API
    const fetchApplications = async (page = 1, perPage = 6, search = "", filters = {}) => {
        try {
            setLoading(true)
            const response = await applicationsService.getApplications(page, perPage, search, filters)
            if (response.data) {
                const transformed = response.data.map((u) => ({
                    ...u,
                    createdAt: new Date(u.created_at).toISOString().split("T")[0],
                }))

                setApplications(transformed)
                setPaginationMeta(response.meta)
                setCurrentPage(response.meta.current_page)
                setTotalPages(response.meta.last_page)
                setTotalItems(response.meta.total)
                setItemsPerPage(response.meta.per_page)
            }
        } catch (err) {
            setError(err.message || "Gagal memuat Applications")
            showError("Gagal Memuat Applications", err.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchApplications(currentPage, itemsPerPage, searchTerm)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemsPerPage])

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage == 1) {
                // If already on page 1, fetch directly
                fetchApplications(1, itemsPerPage, searchTerm)
            } else {
                // Reset to page 1 when searching/filtering
                setCurrentPage(1)
            }
        }, 400)

        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm])

    const handleEdit = (applications) => {
        setSelectedApplications(applications)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedApplications(null)
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        try {
            const result = await showConfirmation(
                "Hapus Applications?",
                `Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.`,
                "Ya, Hapus!",
            )

            if (result.isConfirmed) {
                showLoading("Menghapus applications...")
                await applicationsService.deleteApplications(id)
                closeLoading()

                showSuccess("Applications Berhasil Dihapus!", "Applications telah dihapus dari sistem")

                // Refresh the current page
                applicationsService.clearApplicationsCache();
                fetchApplications(currentPage, itemsPerPage, searchTerm)
            }
        } catch (err) {
            closeLoading()
            setError(err.message || "Failed to delete product. Please try again.")
            showError("Gagal Menghapus Applications", err.message || "Terjadi kesalahan saat menghapus produk")
            console.error("Error deleting product:", err)
        }
    }

    const handleSave = async (eventUmkmData) => {
        try {
            if (selectedApplications) {
                await applicationsService.updateApplications(selectedApplications.id, eventUmkmData)
            } else {
                console.log("product data", eventUmkmData);

                await applicationsService.createApplications(eventUmkmData)
            }

            setIsModalOpen(false)
            // Refresh the current page
            applicationsService.clearApplicationsCache();
            fetchApplications(currentPage, itemsPerPage, searchTerm)
        } catch (err) {
            setError(err.message || "Failed to save product. Please try again.")
            showError("Gagal Menyimpan Applications", err.message || "Terjadi kesalahan saat menyimpan produk")
            console.error("Error saving product:", err)
            throw err // Re-throw to let modal handle it
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handlePerPageChange = (newPerPage) => {
        setItemsPerPage(newPerPage)
        setCurrentPage(1) // Reset to first page
    }

    // const handleFilterChange = (filterType, value) => {
    //     setCurrentPage(1) // Reset to first page when filtering
    //     switch (filterType) {
    //         case "umkm":
    //             setFilterUMKM(value)
    //             break
    //         case "applications":
    //             setFilterEvent(value)
    //             break
    //         case "status":
    //             setFilterStatus(value)
    //             break
    //         default:
    //             break
    //     }
    // }

    const clearFilters = () => {
        setSearchTerm("")
        setCurrentPage(1)
    }

    const handleRefresh = () => {
        applicationsService.clearApplicationsCache();
        fetchApplications(currentPage, itemsPerPage, searchTerm)
    }

    if (loading && applications.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Applications</h2>
                        <p className="text-gray-600 mt-1">Kelola semua applications dalam satu tempat</p>
                    </div>
                </div>
                <LoadingSpinner text="Memuat applications..." />
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
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Applications</h2>
                        <p className="text-gray-600 mt-1">Kelola data Applications yang terdaftar</p>
                        {paginationMeta.total && (
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {paginationMeta.total} Applications | Halaman {paginationMeta.current_page} dari{" "}
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
                            Tambah Applications
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama Applications..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* <select
                                className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                                value={filterUMKM}
                                onChange={(e) => handleFilterChange("umkm", e.target.value)}
                            >
                                <option value="">Semua UMKM</option>
                                {filterOptions.umkms.map((umkm) => (
                                    <option key={umkm.id} value={umkm.id}>
                                        {umkm.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                                value={filterEvent}
                                onChange={(e) => handleFilterChange("applications", e.target.value)}
                            >
                                <option value="">Semua Event</option>
                                {filterOptions.events.map((applications) => (
                                    <option key={applications.id} value={applications.id}>
                                        {applications.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                                value={filterStatus}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select> */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={itemsPerPage}
                            onChange={(e) => handlePerPageChange(Number.parseInt(e.target.value))}
                        >
                            <option value={10}>10 per halaman</option>
                            <option value={20}>20 per halaman</option>
                            <option value={25}>25 per halaman</option>
                            <option value={50}>50 per halaman</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
                    {loading && applications.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <LoadingSpinner size="sm" text="Memuat..." />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 pl-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Updated At
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Search className="w-12 h-12 text-gray-300 mb-4" />
                                                <p className="text-lg font-medium">Tidak ada data ditemukan</p>
                                                <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((item, i) => (
                                        <tr key={item.id} className="admin-table-row">
                                            <td className="pl-6 py-4 whitespace-nowrap">
                                                {(currentPage - 1) * itemsPerPage + i + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(item.updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
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

            </div>
            <ApplicationsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                data={selectedApplications}
            />
        </div>
    )
}

export default AdminApplications
