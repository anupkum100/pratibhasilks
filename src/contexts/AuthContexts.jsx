import { createContext, useContext, useEffect, useState } from "react";
import { apiCall } from "../serice/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        localStorage.removeItem("ps_token");
        localStorage.removeItem("ps_user");
        setUser(null);
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("ps_token");
        const savedUser = localStorage.getItem("ps_user");

        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("ps_token");
                localStorage.removeItem("ps_user");
                setUser(null);
            }
        }

        setLoading(false);

        const handleLogout = () => {
            localStorage.removeItem("ps_token");
            localStorage.removeItem("ps_user");
            setUser(null);
        };

        window.addEventListener("ps-auth-logout", handleLogout);

        return () => {
            window.removeEventListener("ps-auth-logout", handleLogout);
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