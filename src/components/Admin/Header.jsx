import { ChevronDown, Key, Loader2, LogOut, Menu, Plus, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import fotouser from "../../assets/image.png"
import Cookies from "js-cookie";
import { AuthService } from "../../Services/authService";
import { useNavigate } from "react-router-dom";
import RegisterModal from "./Modals/RegisterModal";
import { showError } from "../../Utils/sweetAlert";
import Swal from "sweetalert2";
import UpdateProfileModal from "./Modals/UpdateProfileModal";
import ChangePasswordModal from "./Modals/ChangePasswordModal";

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const [openTambahAkun, setOpenTambahAkun] = useState(false)
    const [openUpdateProfile, setOpenUpdateProfile] = useState(false)
    const [openGantiPassword, setOpenGantiPassword] = useState(false)
    const [loadingLogout, setLoadingLogout] = useState(false);

    const user = {
        name: Cookies.get("name") || "",
        email: Cookies.get("email") || "",
    }

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            title: "Keluar?",
            text: "Apakah Anda yakin ingin keluar?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#e63946",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, keluar",
            cancelButtonText: "Batal"
        })

        if (!confirm.isConfirmed) return

        try {
            setLoadingLogout(true)
            // showLoading("Sedang keluar...")

            await AuthService.logout()

            Cookies.remove("token")
            Cookies.remove("name")
            Cookies.remove("email")

            // closeLoading()
            // showSuccess("Berhasil keluar")

            navigate("/login")
        } catch (error) {
            // closeLoading()
            console.error("Logout error:", error)
            showError("Gagal Logout", "Terjadi kesalahan saat keluar. Silakan coba lagi.")
        } finally {
            setLoadingLogout(false)
        }
    }

    const handleSaveUser = async (formData) => {
        await AuthService.addUser(formData);
        setOpenTambahAkun(false)
    };

    const handleUpdateProfile = async (formData) => {
        // await AuthService.updateProfile(formData);
        setOpenUpdateProfile(false)
        return await AuthService.updateProfile(formData);
    };

    const handleChangePassword = async (formData) => {
        await AuthService.changePassword(formData);
        setOpenGantiPassword(false)
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-2">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg lg:hidden transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Panel Admin e-Katalog</h1>
                        <p className="text-sm text-gray-500">Kelola data dengan mudah</p>
                    </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 p-1 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <img
                            className="w-8 h-8 rounded-lg object-cover border-2 border-gray-200"
                            src={fotouser}
                            alt="User Avatar"
                        />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-700">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.email}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200">
                            {/* Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                                <div className="flex items-center space-x-3">
                                    <img
                                        className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm"
                                        src={fotouser}
                                        alt="User Avatar"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-600">{user.email}</p>
                                        {/* <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                            <i className="fas fa-circle text-green-500 text-xs mr-1"></i>
                                            Online
                                        </span> */}
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <ul className="py-2">
                                <li>
                                    <button
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                        onClick={() => {
                                            // TODO: trigger modal tambah user
                                            setOpenTambahAkun(true)
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-3 text-blue-500" />
                                        Tambah Akun
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                                        onClick={() => {
                                            // TODO: trigger modal update profil
                                            setOpenUpdateProfile(true)
                                        }}
                                    >
                                        <User className="w-4 h-4 mr-3 text-gray-500" />
                                        Update Profil
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                                        onClick={() => {
                                            // TODO: trigger modal ganti password
                                            setOpenGantiPassword(true)
                                        }}
                                    >
                                        <Key className="w-4 h-4 mr-3 text-gray-500" />
                                        Ganti Password
                                    </button>
                                </li>
                            </ul>


                            {/* Logout */}
                            <div className="py-2 border-t border-gray-100">
                                <button
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                                    onClick={() => {
                                        // TODO: tambahkan logika logout
                                        handleLogout()
                                    }}
                                >
                                    {loadingLogout ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-red-500 mr-3" />
                                            <span>Keluar...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="w-4 h-4 mr-3 text-red-500" />
                                            Keluar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <RegisterModal
                isOpen={openTambahAkun}
                onClose={() => setOpenTambahAkun(false)}
                onSave={handleSaveUser}
            />

            <UpdateProfileModal
                isOpen={openUpdateProfile}
                onClose={() => setOpenUpdateProfile(false)}
                onSave={handleUpdateProfile}
                data={user}
            />

            <ChangePasswordModal
                isOpen={openGantiPassword}
                onClose={() => setOpenGantiPassword(false)}
                onSave={handleChangePassword}
            />
        </header>
    )
}

export default AdminHeader