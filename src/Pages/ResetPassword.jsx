import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config.js";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const getFriendlyMessage = (apiMessage) => {
        const messageMap = {
            'passwords.token': 'Token kadaluarsa. Silakan minta link reset password baru.',
            'passwords.user': 'Email tidak ditemukan.',
            // Tambahkan mapping lain jika perlu
        };

        return messageMap[apiMessage] || apiMessage || 'Terjadi kesalahan.';
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            await Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                text: 'Password dan konfirmasi password wajib diisi.',
            });
            return;
        }

        if (password !== confirmPassword) {
            return Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Konfirmasi sandi tidak cocok.",
            });
        }

        const confirm = await Swal.fire({
            title: "Reset Kata Sandi?",
            text: "Apakah Anda yakin ingin mengganti kata sandi?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Ganti",
            cancelButtonText: "Batal",
        });

        if (!confirm.isConfirmed) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("password_confirmation", confirmPassword);

            const response = await fetch(`${API_BASE_URL}/reset`, {
                method: 'POST',
                // credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: result.message || "Kata sandi berhasil diperbarui.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                const friendlyMessage = getFriendlyMessage(result.message);
                throw new Error(friendlyMessage);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat reset sandi.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        (async () => {
            await Swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Link reset password tidak valid atau sudah kadaluarsa.',
                confirmButtonText: 'OK',
            });
            navigate("/login");
        })();
        return;
    }

    return (
        <div className="relative flex max-lg:flex-col-reverse justify-center xl:justify-center items-center gap-12 lg:mt-48 xl:gap-24">
            {/* <img src={SignImg} alt="Sign Image" /> */}
            <div className="flex flex-col gap-6 md:gap-8 md:mx-10 items-center sm:items-start max-lg:mt-40 justify-center">
                <h1 className="text-xl md:text-4xl font-medium font-inter ">
                    Reset Kata Sandi
                </h1>
                <p>Silakan masukkan kata sandi baru</p>
                <form
                    className="flex flex-col gap-6 md:gap-8 w-72 md:w-96"
                    onSubmit={handleResetPassword}
                >
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="border-b border-black focus:outline-none focus:border-blue-500 py-2 px-1 mt-4 w-full pr-10"
                            placeholder="Masukkan kata sandi baru Anda *"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                            tabIndex={-1}
                        >
                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>


                    <div className="relative">
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="border-b border-black focus:outline-none focus:border-blue-500 py-2 px-1 mt-4 w-full pr-10"
                            placeholder="Ulangi sandi baru Anda *"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>


                    <div className="flex items-center gap-2 justify-between mt-4">
                        {/* <Button
                            component={Link}
                            to="/admin"
                            sx={{
                                color: "white",
                                fontSize: "16px",
                                bgcolor: "hsla(0, 68%, 56%, 1)",
                                textTransform: "none",
                                padding: "16px 0",
                                borderRadius: "4px",
                                fontWeight: "500",
                                width: "40%",
                                ":hover": {
                                    bgcolor: "hsla(0, 68%, 56%, .9)",
                                },
                            }}
                            variant="contained"
                            color="primary"
                            className="my-2"
                        >
                            {i18n.t("loginPage.login")}
                        </Button> */}
                        <button
                            type="submit"
                            className="my-2 w-full bg-[#e63946] hover:bg-[#e63946]/90 text-white text-base font-medium py-4 px-4 rounded flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    <span className="text-white">Memuat...</span>
                                </>
                            ) : (
                                "Reset"
                            )}

                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
