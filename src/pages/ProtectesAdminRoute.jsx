import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

export default function ProtectedAdminRoute() {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}