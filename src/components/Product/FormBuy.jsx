import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../config";
import { RotateCcw } from "lucide-react";

const STORAGE_KEY = "buyFormData";

const FormBuy = ({ productId, applicationId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        buyer_name: "",
        buyer_phone: "",
        buyer_address: "",
    });
    const [errors, setErrors] = useState({});

    // 1) Load from localStorage once
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const resetForm = () => {
        setFormData({
            buyer_name: "",
            buyer_phone: "",
            buyer_address: "",
        });
        setErrors({});
        localStorage.removeItem(STORAGE_KEY); // clear if you want
    };

    const closeModal = () => {
        setIsOpen(false);
        // keep data in storage so next time it’s still there
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);
        // 2) Save each change
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.buyer_name.trim()) newErrors.buyer_name = "Nama harus diisi";
        if (!formData.buyer_phone.trim())
            newErrors.buyer_phone = "Nomor telepon harus diisi";
        else if (!/^[0-9]{10,13}$/.test(formData.buyer_phone))
            newErrors.buyer_phone = "Nomor telepon harus 10-13 digit angka";
        if (!formData.buyer_address.trim())
            newErrors.buyer_address = "Alamat harus diisi";
        else if (formData.buyer_address.length < 10)
            newErrors.buyer_address = "Alamat terlalu pendek";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        const payload = {
            ...formData,
            product_id: productId,
            application_id: applicationId,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/products/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                let msg = "Terjadi kesalahan.";
                if (response.status === 400) msg = "Data tidak valid.";
                else if (response.status === 500) msg = "Server error.";

                Swal.fire({ icon: "error", title: "Gagal", text: msg });
                return;
            }

            if (data?.wa_link) {
                Swal.fire({
                    icon: "success",
                    title: "Sukses",
                    text: "Anda akan diarahkan ke WhatsApp.",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.href = data.wa_link;
                });
                // optionally clear saved data on successful order:
                // resetForm();
                closeModal();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Link WhatsApp tidak ditemukan.",
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan jaringan. Coba lagi.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-red-600 text-white px-6 md:px-12 py-3 text-sm md:text-base rounded-xl font-medium shadow-md hover:bg-red-500 transition-all duration-200 hover:-translate-y-1"
            >
                Beli Sekarang
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                                <div className="flex flex-col items-center">
                                    <svg
                                        className="animate-spin h-8 w-8 text-blue-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">Memproses pesanan...</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Form Pembelian</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => !isLoading && resetForm()}
                                    disabled={isLoading}
                                    title="Kosongkan Form"
                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    className="text-gray-500 text-xl hover:text-gray-700"
                                    onClick={() => !isLoading && closeModal()}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4 relative z-0">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    name="buyer_name"
                                    value={formData.buyer_name}
                                    onChange={handleChange}
                                    placeholder="Nama penerima"
                                    disabled={isLoading}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.buyer_name ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.buyer_name && (
                                    <p className="text-xs italic text-red-500 mt-1">{errors.buyer_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor WhatsApp
                                </label>
                                <input
                                    name="buyer_phone"
                                    value={formData.buyer_phone}
                                    onChange={handleChange}
                                    placeholder="081234567890"
                                    disabled={isLoading}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.buyer_phone ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.buyer_phone && (
                                    <p className="text-xs italic text-red-500 mt-1">{errors.buyer_phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    name="buyer_address"
                                    value={formData.buyer_address}
                                    onChange={handleChange}
                                    placeholder="Jl. Nama Jalan No. X, Desa. Kecamatan, Kabupaten."
                                    rows="3"
                                    disabled={isLoading}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.buyer_address ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.buyer_address && (
                                    <p className="text-xs italic text-red-500 mt-1">{errors.buyer_address}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => !isLoading && closeModal()}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                {/* <button
                                    type="button"
                                    onClick={(resetForm)}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm rounded-lg  bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    Kosongkan Form
                                </button> */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    Pesan Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormBuy;
