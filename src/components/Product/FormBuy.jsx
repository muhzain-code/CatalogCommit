import { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../config";

const FormBuy = ({ productId, applicationId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        buyer_name: "",
        buyer_phone: "",
        buyer_address: "",
    });
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setFormData({
            buyer_name: "",
            buyer_phone: "",
            buyer_address: "",
        });
        setErrors({});
    };

    const closeModal = () => {
        setIsOpen(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.buyer_name.trim()) newErrors.buyer_name = "Nama harus diisi";
        if (!formData.buyer_phone.trim()) newErrors.buyer_phone = "Nomor telepon harus diisi";
        else if (!/^[0-9]{10,13}$/.test(formData.buyer_phone)) newErrors.buyer_phone = "Nomor telepon harus 10-13 digit angka";
        if (!formData.buyer_address.trim()) newErrors.buyer_address = "Alamat harus diisi";
        else if (formData.buyer_address.length < 10) newErrors.buyer_address = "Alamat terlalu pendek";

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

                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: msg,
                });
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

                closeModal();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Link WhatsApp tidak ditemukan.",
                });
            }

        } catch (err) {
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
                className={`motion-safe:hover:animate-pulse text-sm md:text-base md:px-12 py-3 rounded px-6
    bg-red-600 text-white hover:bg-red-500 transition-transform duration-100 transform hover:translate-y-[-4px]`}
            >
                Beli Sekarang
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                                <div className="text-center">
                                    <svg
                                        className="animate-spin mx-auto h-8 w-8 text-blue-600"
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
                                    <p className="mt-2 text-sm text-gray-600">Memproses...</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">Form Pembelian</h2>
                            <button
                                className="text-gray-600 text-xl"
                                onClick={() => !isLoading && closeModal()}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4 relative z-0">
                            <div>
                                <label className="block font-medium mb-1">Nama Lengkap</label>
                                <input
                                    name="buyer_name"
                                    value={formData.buyer_name}
                                    onChange={handleChange}
                                    placeholder="Nama penerima"
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.buyer_name ? "border-red-500" : "border-gray-300"
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.buyer_name && <p className="text-red-500 text-sm">{errors.buyer_name}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Nomor WhatsApp</label>
                                <input
                                    name="buyer_phone"
                                    value={formData.buyer_phone}
                                    onChange={handleChange}
                                    placeholder="081234567890"
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.buyer_phone ? "border-red-500" : "border-gray-300"
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.buyer_phone && <p className="text-red-500 text-sm">{errors.buyer_phone}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Alamat Lengkap</label>
                                <textarea
                                    name="buyer_address"
                                    value={formData.buyer_address}
                                    onChange={handleChange}
                                    placeholder="Jl. Nama Jalan No. X, Kota"
                                    rows="3"
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.buyer_address ? "border-red-500" : "border-gray-300"
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.buyer_address && <p className="text-red-500 text-sm">{errors.buyer_address}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                                    onClick={() => !isLoading && closeModal()}
                                    disabled={isLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${isLoading ? "opacity-60 cursor-not-allowed" : ""
                                        }`}
                                    disabled={isLoading}
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
