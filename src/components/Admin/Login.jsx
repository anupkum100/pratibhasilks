import { GoogleLogin } from "@react-oauth/google";
import { ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContexts";

export default function LoginModal({ open, onClose }) {
    const { googleLogin } = useAuth();
    const [error, setError] = useState("");

    if (!open) return null;

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError("");

            if (!credentialResponse?.credential) {
                setError("Google credential missing. Please try again.");
                return;
            }

            await googleLogin(credentialResponse.credential);
            onClose();
        } catch (err) {
            setError(err.message || "Google login failed.");
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#d6b56d]/30 bg-[#fffaf0] shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8a6a2f] via-[#d6b56d] to-[#8a6a2f]" />

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 rounded-full border border-black/10 bg-white/70 p-2 text-black/70 transition hover:bg-black hover:text-white"
                >
                    <X size={18} />
                </button>

                <div className="px-8 pb-8 pt-11">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#d6b56d]/40 bg-black text-[#d6b56d] shadow-lg">
                            <ShieldCheck size={30} />
                        </div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.38em] text-[#9b7a3d]">
                            Pratibha Silks
                        </p>

                        <h2 className="font-serif text-3xl font-semibold text-black">
                            Admin Access
                        </h2>

                        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-black/55">
                            Secure Google login for authorised Pratibha Silks administrators only.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#d6b56d]/25 bg-white px-5 py-6 shadow-sm">
                        <div className="mb-5 text-center">
                            <p className="text-sm font-medium text-black">
                                Continue with your approved admin Google account
                            </p>
                            <p className="mt-1 text-xs text-black/45">
                                Customer login is not enabled.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google login failed. Please try again.")}
                                theme="outline"
                                size="large"
                                shape="pill"
                                text="signin_with"
                            />
                        </div>

                        {error && (
                            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 rounded-2xl border border-[#d6b56d]/25 bg-[#f6eddc] px-4 py-3 text-center text-xs leading-5 text-black/55">
                        Access is restricted using Google verification and backend admin email validation.
                    </div>
                </div>
            </div>
        </div>
    );
}