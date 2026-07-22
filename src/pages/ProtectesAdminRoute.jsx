import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

export default function ProtectedAdminRoute() {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main className="min-h-[60vh] bg-[#F8F3EC] px-5 py-16">
                <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#9A7B4F]">
                        Admin Access
                    </p>
                    <h1 className="mt-3 font-serif text-4xl">
                        Checking session...
                    </h1>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        sessionStorage.setItem(
            "ps_admin_return_to",
            location.pathname + location.search
        );
        return <Navigate to="/" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
