import { useState } from "react";
import { Link } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { auth } from "../Auth/firebase.jsx";
import {
    signInWithEmailAndPassword,
} from "firebase/auth";
import { ArrowLeft } from "lucide-react";

const Forgot = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            // Attempt to sign in with email and password
            await signInWithEmailAndPassword(auth, email, password);
            // Update message state on successful login
            setMessage("Login successful!");
            setError("");
            setOpen(true);
            setTimeout(() => {
                window.location.href = "/account";
            }, 2000);
            // Clear input fields
            setEmail("");
            setPassword("");
        } catch (error) {
            // Handle login errors
            setError(error.message);
            setOpen(true);
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
                        />
                    </div>

                    <div className="flex flex-col items-center gap-2 justify-between mt-4">
                        <button
                            type="submit"
                            className="my-2 w-full bg-red-600 hover:bg-red-500 text-white font-medium text-base py-4 px-4 rounded"
                        >
                            Kirim Link Reset
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
