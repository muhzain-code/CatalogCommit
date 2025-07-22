"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, Calendar, Filter, AlertCircle, RefreshCw, Megaphone } from "lucide-react"
import EventsModal from "../../components/Admin/Modals/EventsModal"
import LoadingSpinner from "../../components/Admin/LoadingSpinner"
import ErrorNotification from "../../components/Admin/ErrorNotification"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../Utils/sweetAlert"
import { eventService } from "../../Services/eventService"
import Pagination from "../../components/Admin/Pagination"
import ImageWithFallback from "../../components/Admin/ImageWithFallback"
import { umkmService } from "../../Services/umkmService"

const AdminEvents = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEvents, setSelectedEvents] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [filterStatus, setFilterStatus] = useState("")
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterUMKM, setFilterUMKM] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [paginationMeta, setPaginationMeta] = useState({})

    const [filterOptions, setFilterOptions] = useState({
        umkms: [],
    })

    const fetchEvents = async (page = 1, perPage = 6, search = "", filters = {}) => {
        try {
            setLoading(true)
            const response = await eventService.getEvents(page, perPage, search, filters)
            if (response.data) {
                const transformed = response.data.map((u) => ({
                    ...u,
                    status: u.is_active ? "Aktif" : "Nonaktif",
                    createdAt: new Date(u.created_at).toISOString().split("T")[0],
                }))

                const initialUMKMRes = await umkmService.getUMKMs(1, 1);
                const totalUMKM = initialUMKMRes.meta?.total || 0;

                const [umkmResponse] = await Promise.all([
                    umkmService.getUMKMs(1, totalUMKM),
                ]);

                // 3. Set ke filter
                setFilterOptions({
                    umkms: umkmResponse.data || [],
                });

                setEvents(transformed)
                setPaginationMeta(response.meta)
                setCurrentPage(response.meta.current_page)
                setTotalPages(response.meta.last_page)
                setTotalItems(response.meta.total)
                setItemsPerPage(response.meta.per_page)
            }
        } catch (err) {
            setError(err.message || "Gagal memuat Events")
            showError("Gagal Memuat Events", err.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents(currentPage, itemsPerPage, searchTerm, {
            umkm_id: filterUMKM,
            is_active: filterStatus,
            start_date: filterStartDate,
            end_date: filterEndDate
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemsPerPage])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
            fetchEvents(1, itemsPerPage, searchTerm, {
                umkm_id: filterUMKM,
                is_active: filterStatus,
                start_date: filterStartDate,
                end_date: filterEndDate
            })
        }, 400)
        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, searchTerm, filterEndDate, filterStartDate, filterUMKM])

    const handleEdit = (event) => {
        setSelectedEvents(event)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedEvents(null)
        setIsModalOpen(true)
    }

    const handleRefresh = () => {
        eventService.clearEventsCache();
        fetchEvents(currentPage, itemsPerPage, searchTerm, {
            umkm_id: filterUMKM,
            is_active: filterStatus,
            start_date: filterStartDate,
            end_date: filterEndDate
        })
    }

    const handleSave = async (categoryData) => {
        try {
            if (selectedEvents) {
                console.log("kategori data", categoryData);

                await eventService.updateEvents(selectedEvents.id, categoryData)
            } else {
                console.log("product data", categoryData);

                await eventService.createEvents(categoryData)
            }

            setIsModalOpen(false)
            // Refresh the current page
            eventService.clearEventsCache();
            fetchEvents(currentPage, itemsPerPage, searchTerm, {
                umkm_id: filterUMKM,
                is_active: filterStatus,
                start_date: filterStartDate,
                end_date: filterEndDate
            })
        } catch (err) {
            setError(err.message || "Failed to save kategori. Please try again.")
            const resData = error?.response?.data
            const errorMsg = resData?.message || "Terjadi kesalahan saat menyimpan data Event"

            if (resData?.error) {
                // Gabungkan semua pesan error jadi satu string
                const validationMessages = Object.entries(resData.error)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n")

                showError(errorMsg, validationMessages)
            } else {
                showError("Gagal Menyimpan data Event", error.message || errorMsg)
            }
            console.error("Error saving data kategori:", err)
            throw err // Re-throw to let modal handle it
        }
    }

    const handleDelete = async (id, eventName) => {
        try {
            const result = await showConfirmation(
                "Hapus Event?",
                `Apakah Anda yakin ingin menghapus event "${eventName}"? Tindakan ini tidak dapat dibatalkan.`,
                "Ya, Hapus!",
            )

            if (result.isConfirmed) {
                showLoading("Menghapus Event...")
                await eventService.deleteEvents(id)
                closeLoading()

                showSuccess("Event Berhasil Dihapus!", "Event telah dihapus dari sistem")

                // Refresh the current page
                eventService.clearEventsCache();
                fetchEvents(currentPage, itemsPerPage, searchTerm, {
                    umkm_id: filterUMKM,
                    is_active: filterStatus,
                    start_date: filterStartDate,
                    end_date: filterEndDate
                })
            }
        } catch (err) {
            closeLoading()
            setError(err.message || "Failed to delete kategori. Please try again.")
            showError("Gagal Menghapus Event", err.message || "Terjadi kesalahan saat menghapus Event")
            console.error("Error deleting kategori:", err)
        }
    }

    const handlePerPageChange = (newPerPage) => {
        setItemsPerPage(newPerPage)
        setCurrentPage(1) // Reset to first page
    }

    const handleFilterChange = (filterType, value) => {
        setCurrentPage(1) // Reset to first page when filtering
        switch (filterType) {
            case "umkm":
                setFilterUMKM(value)
                break
            case "status":
                setFilterStatus(value)
                break
            default:
                break
        }
    }

    const handlePageChange = (page) => setCurrentPage(page)

    const clearFilters = () => {
        setSearchTerm("")
        // setFilterBrand("")
        // setFilterKategori("")
        // setFilterEvents("")
        setFilterEndDate("")
        setFilterStartDate("")
        setFilterUMKM("")
        setFilterStatus("")
        setCurrentPage(1)
    }

    if (loading && events.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Event</h2>
                        <p className="text-gray-600 mt-1">Kelola semua event Event dalam satu tempat</p>
                    </div>
                </div>
                <LoadingSpinner text="Memuat event..." />
                <ErrorNotification />
            </div>
        )
    }

    // const isPromoActive = (endDate) => {
    //     return new Date(endDate) >= new Date()
    // }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);
    }

    return (
        <div>
            <div className="space-y-6">
                <ErrorNotification />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Event</h2>
                        <p className="text-gray-600 mt-1">Kelola data Event yang terdaftar</p>
                        {paginationMeta.total && (
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {paginationMeta.total} Event | Halaman {paginationMeta.current_page} dari{" "}
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
                            Tambah Event
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama Event..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
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
                            value={filterStatus}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
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
                            <option value={10}>10 per halaman</option>
                            <option value={20}>20 per halaman</option>
                            <option value={25}>25 per halaman</option>
                            <option value={50}>50 per halaman</option>
                        </select>
                        <div className="flex flex-col">
                            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">
                                Tanggal Akhir
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
                    {loading && events.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <LoadingSpinner size="sm" text="Memuat..." />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 py-4 pl-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banner</th> */}
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th> */}
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {events.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Search className="w-12 h-12 text-gray-300 mb-4" />
                                                <p className="text-lg font-medium">Tidak ada Event ditemukan</p>
                                                <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event, i) => (
                                        <tr key={event.id}>
                                            <td className="py-4 pl-4 whitespace-nowrap text-center">
                                                {(currentPage - 1) * itemsPerPage + i + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                <div className="flex items-start">
                                                    <ImageWithFallback
                                                        srcs={[event.photo]}
                                                        alt={event.name}
                                                        className="h-12 min-w-20 max-w-20 rounded-lg object-cover shadow-sm shrink-0"
                                                        fallbackIcon={Megaphone}
                                                    />
                                                    <div className="ml-4 max-w-xs self-center">
                                                        <div className="text-sm font-medium text-gray-900 break-words">{event.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-sm line-clamp-2">
                                                {event.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {formatDate(event?.start_date)}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        s/d {formatDate(event.end_date)}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                {event.is_promo_event && (
                                                    <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                                                        Promo Event
                                                    </span>
                                                )}
                                                {event.is_umkm_event && (
                                                    <span className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        Event UMKM
                                                    </span>
                                                )}
                                            </td> */}
                                            <td className="px-6 py-4">
                                                <span className={`admin-status-badge ${event.is_active ? "bg-[#d1fae5] text-[#065f46]" : "bg-red-100 text-red-800"}`}>
                                                    {event.is_active ? "Aktif" : "Berakhir"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id, event.name)}
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
            <EventsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                data={selectedEvents}
                dataUmkm={filterOptions.umkms}
            />
        </div>
    )
}

export default AdminEvents
