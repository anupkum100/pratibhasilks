import { createContext, useContext, useEffect, useState } from "react";
import { apiCall } from "../serice/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearSession = () => {
        localStorage.removeItem("ps_token");
        localStorage.removeItem("ps_user");
        setUser(null);
    };

    const googleLogin = async (credential) => {
        const response = await apiCall("/api/auth/google", "POST", { credential });

        if (response?.error) {
            throw new Error(response.error.message);
        }

        localStorage.setItem("ps_token", response.token);
        localStorage.setItem("ps_user", JSON.stringify(response.user));

        setUser(response.user);

        return response;
    };

    const logout = () => {
        clearSession();
    };

    useEffect(() => {
        let mounted = true;

        const verifySession = async () => {
            const savedToken = localStorage.getItem("ps_token");

            if (!savedToken) {
                if (mounted) {
                    clearSession();
                    setLoading(false);
                }
                return;
            }

            const response = await apiCall("/api/auth/me");

            if (!mounted) return;

            if (response?.error || !response?.user) {
                clearSession();
            } else {
                localStorage.setItem("ps_user", JSON.stringify(response.user));
                setUser(response.user);
            }

            setLoading(false);
        };

        verifySession();

        const handleLogout = () => {
            clearSession();
        };

        const handleStorage = (event) => {
            if (!["ps_token", "ps_user"].includes(event.key)) return;

            if (!localStorage.getItem("ps_token")) {
                clearSession();
            }
        };

        window.addEventListener("ps-auth-logout", handleLogout);
        window.addEventListener("storage", handleStorage);

        return () => {
            mounted = false;
            window.removeEventListener("ps-auth-logout", handleLogout);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                googleLogin,
                logout,
                isAdmin: user?.role === "admin",
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
