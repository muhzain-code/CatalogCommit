import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import i18n from "../components/common/components/LangConfig.jsx";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config.js";

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleLogIn = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Simpan ke cookie tanpa expired (session only)
                Cookies.set("token", result.token);
                Cookies.set("name", result.user.name);
                Cookies.set("email", result.user.email);

                Swal.fire({
                    icon: "success",
                    title: "Berhasil Login",
                    text: result.message || "Login berhasil",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setTimeout(() => {
                    navigate("/admin") // redirect ke halaman admin
                }, 2000);
            } else {
                throw new Error(result.message || "Login gagal");
            }

        } catch (error) {
            setError(true)
            setMessage(error.message)
            Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: error.message || "Terjadi kesalahan.",
            });
        } finally {
            setLoading(false)
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
                    Selamat Datang
                </h1>
                <p>Silakan masuk untuk melanjutkan</p>
                <form
                    className="flex flex-col gap-6 md:gap-8 w-72 md:w-96"
                    onSubmit={handleLogIn}
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
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <input
                            id="password"
                            type="password"
                            className="border-b border-black focus:outline-none focus:border-blue-500 py-2 px-1 mt-4"
                            placeholder="Masukkan kata sandi Anda *"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
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
                            className="my-2 w-2/5 bg-[#e63946] hover:bg-[#e63946]/90 text-white text-base font-medium py-4 px-4 rounded flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    <span className="text-white">Memuat...</span>
                                </>
                            ) : (
                                i18n.t("loginPage.login")
                            )}
                        </button>


                        <Link
                            to="/forgot"
                            className="text-base text-red-500 hover:underline font-medium"
                        >
                            {i18n.t("loginPage.forgot")}
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

export default LogIn;
