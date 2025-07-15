import { useState } from "react";
import { Link } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { ArrowLeft, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config.js";
import Swal from "sweetalert2";

const Forgot = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage("");

        try {
            const response = await fetch(`${API_BASE_URL}/forgot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal mengirim email reset.");
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Link reset berhasil dikirim ke email Anda.",
                timer: 3000,
                showConfirmButton: false,
            });

            setEmail("");
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.message || "Terjadi kesalahan.",
            });
        } finally {
            setOpen(true);
            setLoading(false);
        }
    };

    // const handleForgotPassword = async () => {
    //     try {
    //         // Send password reset email
    //         await sendPasswordResetEmail(auth, email);
    //         setMessage("Password reset email sent. Check your inbox.");
    //         setOpen(true);
    //     } catch (error) {
    //         setError(error.message);
    //         setOpen(true);
    //     }
    // };

    return (
        <div className="relative flex max-lg:flex-col-reverse justify-center xl:justify-center items-center gap-12 lg:mt-48 xl:gap-24">
            {/* <img src={SignImg} alt="Sign Image" /> */}
            <div className="flex flex-col gap-6 md:gap-8 md:mx-10 items-center sm:items-start max-lg:mt-40 justify-center">
                <h1 className="text-xl md:text-4xl font-medium font-inter ">
                    Lupa Sandi
                </h1>
                <p>Silakan masukkan email anda</p>
                <form
                    className="flex flex-col gap-6 md:gap-8 w-72 md:w-96"
                    onSubmit={handleForgotPassword}
                >
                    <div className="flex flex-col gap-1">
                        <input
                            id="email"
                            type="text"
                            className="border-b border-black focus:outline-none focus:border-blue-500 py-2 px-1"
                            placeholder="Masukkan email *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col items-center gap-2 justify-between mt-4">
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
                                "Kirim Link Reset"
                            )}

                        </button>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Login
                        </Link>
                    </div>

                </form>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity={error ? "error" : "success"}
                    sx={{ width: "100%" }}
                >
                    {error ? error : message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Forgot;
